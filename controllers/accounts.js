const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patients");
const Account = require("../models/accounts");
const Doctor = require("../models/doctors");

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await Account.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }

    let isPasswordMatch = false;

    if (user.role === "patient") {
      const patient = await Patient.findById(user.userId);
      if (patient) {
        isPasswordMatch = await verifyPassword(password, patient.password);
      }
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findById(user.userId);
      if (doctor) {
        isPasswordMatch = await verifyPassword(password, doctor.password);
      }
    }

    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = await jwt.sign({ _id: user.userId }, "secret", {
      expiresIn: "1h",
    });

    const payload = {
      msg: "Login successfull!",
      userId: user.userId,
      token: token,
      role: user.role,
    };

    return res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await Account.findOne({ userId: _id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let profileData;

    if (user.role === "patient") {
      const patient = await Patient.findById(_id);
      const { password, ...data } = patient.toJSON();
      profileData = data;
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findById(_id).populate({
        path: "specializationId",
        select: "_id title",
      });
      const { password, ...data } = doctor.toJSON();
      profileData = data;
    } else {
      return res.status(400).json({ msg: "Invalid user role" });
    }

    return res.status(200).json(profileData);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Account.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let data;
    let hashedPassword;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    if (user.role === "patient") {
      const patient = await Patient.findOneAndUpdate(
        { _id: id },
        { ...req.body, password: hashedPassword },
        { new: true, runValidators: true }
      );
      data = patient;
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOneAndUpdate(
        { _id: id },
        { ...req.body, password: hashedPassword },
        { new: true, runValidators: true }
      );
      data = doctor;
    } else {
      return res.status(400).json({ msg: "Invalid user role" });
    }
    return res.status(200).json({ msg: "Profile updated successfully", data });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
};
