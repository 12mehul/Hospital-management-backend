const Doctor = require("../models/doctors");
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

const getSpecialtiesWithDoctorCount = async (req, res) => {
  try {
    // Fetch all specialties
    const specialties = await Speciality.find({}, { _id: 1, title: 1 });

    // Fetch doctor count for each specialty
    const specialtiesWithCounts = await Promise.all(
      specialties.map(async (specialty) => {
        const doctorCount = await Doctor.countDocuments({
          specializationId: { $in: [specialty._id.toString()] }, // Ensure matching within array of specializationId
        });

        return {
          _id: specialty._id,
          title: specialty.title,
          doctorCount: doctorCount || 0, // Ensure doctorCount is 0 if no matches
        };
      })
    );

    return res.status(200).json({ specialities: specialtiesWithCounts });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createSpeciality,
  getSpecialities,
  getSpecialtiesWithDoctorCount,
};
