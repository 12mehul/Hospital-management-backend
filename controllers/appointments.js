const Appointment = require("../models/appointments");
const Patient = require("../models/patients");
const Slot = require("../models/slots");

const bookAppointment = async (req, res) => {
  try {
    const { specializationId, doctorId, patientId, slotId, message } = req.body;

    if (!specializationId || !doctorId || !patientId || !slotId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const appointment = await Appointment.create({
      specializationId,
      doctorId,
      patientId,
      slotId,
      message,
    });

    // Update the patient document by adding the doctorId to the doctor_ids array if it doesn't already exist
    await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { doctor_ids: doctorId } }, // $addToSet ensures no duplicates
      { new: true } // Return the updated document
    );

    // Update the slot document by setting the isAvailable flag
    await Slot.findByIdAndUpdate(slotId, { isAvailable: false });

    return res.status(201).json({ msg: "Appointment booked successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    if (!patientId && !doctorId) {
      return res.status(400).json({ msg: "ID is required" });
    }

    let query = {};
    if (patientId) {
      query.patientId = patientId;
    }
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "specializationId",
        select: "_id title",
      })
      .populate({
        path: "doctorId",
        select: "_id doctorID firstName lastName",
      })
      .populate({
        path: "patientId",
        select: "_id patientID firstName lastName",
      })
      .populate({
        path: "slotId",
        select: "_id date time",
      });

    return res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
};
