const bcrypt = require("bcryptjs");
const Patient = require("../models/patients");
const Account = require("../models/accounts");
const patientUniqueId = require("../autoGenerateId/patientUniqueId");

const registration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      fullAddress,
      phone,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !dob ||
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

    const patientID = await patientUniqueId(res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Patient.create({
      patientID,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      gender,
      fullAddress,
      phone,
    });

    if (user) {
      await Account.create({ email, userId: user._id, role: "patient" });
    }
    return res.status(201).json({ msg: "Patient created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { doctorId } = req.query;
    // Explicitly use the $in operator to match doctorId in the doctor_ids array
    const patients = await Patient.find(
      { doctor_ids: { $in: [doctorId] } },
      { password: 0, doctor_ids: 0 }
    );
    return res.status(200).json({ patients });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registration,
  getAllPatients,
};
