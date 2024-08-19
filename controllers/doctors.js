const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctors");
const Account = require("../models/accounts");

const registration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience,
      dob,
      age,
      gender,
      fullAddress,
      phone,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !experience ||
      !dob ||
      !age ||
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      experience,
      dob,
      age,
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
    const doctors = await Doctor.find();
    return res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registration,
  getAllDoctors,
};
