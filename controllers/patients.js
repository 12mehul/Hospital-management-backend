const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patients");

const registration = async (req, res) => {
  try {
    const { name, email, password, dob, age, gender, fullAddress, phone } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !dob ||
      !age ||
      !gender ||
      !fullAddress ||
      !phone
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExist = await Patient.findOne({ email });
    if (userExist) {
      return res.status(403).json({ msg: "Email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Patient.create({
      name,
      email,
      password: hashedPassword,
      dob,
      age,
      gender,
      fullAddress,
      phone,
    });
    return res.status(201).json({ msg: "Patient created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await Patient.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1h" });

    const payload = {
      msg: "Login successfull!",
      userId: user._id,
      token: token,
      role: "patient",
    };

    return res.status(200).send({
      msg: payload.msg,
      userId: payload.userId,
      token: payload.token,
      role: payload.role,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { doctorId } = req.query;
    // Explicitly use the $in operator to match doctorId in the doctor_ids array
    const patients = await Patient.find({ doctor_ids: { $in: [doctorId] } });
    return res.status(200).json({ patients });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { role } = req.body;
    if (role === "patient") {
      const patient = await Patient.findById({ _id });
      const { password, ...data } = patient.toJSON();
      res.send(data);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registration,
  login,
  getAllPatients,
  getProfile,
};
