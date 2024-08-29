const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorID: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  specializationId: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  fullAddress: {
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
