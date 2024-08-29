const Speciality = require("../models/speciality");

const createSpeciality = async (req, res) => {
  try {
    const { title } = req.body;
    await Speciality.create({ title });
    res.status(201).json({ msg: "Speciality created successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSpecialities = async (req, res) => {
  try {
    const specialities = await Speciality.find({});
    res.status(200).json({ specialities });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createSpeciality,
  getSpecialities,
};
