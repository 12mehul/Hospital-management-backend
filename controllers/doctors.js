const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctors");
const Account = require("../models/accounts");
const doctorUniqueId = require("../autoGenerateId/doctorUniqueId");

const registration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specializationId,
      experience,
      dob,
      licenseNumber,
      gender,
      fullAddress,
      phone,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !specializationId ||
      !experience ||
      !dob ||
      !licenseNumber ||
      !gender ||
      !fullAddress ||
      !phone
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExist = await Account.findOne({ email });
    if (userExist) {
      return res.status(403).json({ msg: "Email already exist" });
    }

    const doctorID = await doctorUniqueId(res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Doctor.create({
      doctorID,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specializationId,
      experience,
      dob,
      licenseNumber,
      gender,
      fullAddress,
      phone,
    });

    if (user) {
      await Account.create({ email, userId: user._id, role: "doctor" });
    }
    return res.status(201).json({ msg: "Doctor created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { specializationId } = req.query;
    const query = specializationId ? { specializationId } : {};
    const doctors = await Doctor.find(query, { password: 0 }).populate({
      path: "specializationId",
      select: "_id title",
    });
    return res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registration,
  getAllDoctors,
};
