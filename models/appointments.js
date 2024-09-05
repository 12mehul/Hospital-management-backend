const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Speciality",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Slot",
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
