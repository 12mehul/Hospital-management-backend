const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const Speciality = mongoose.model("Speciality", specialitySchema);

module.exports = Speciality;
