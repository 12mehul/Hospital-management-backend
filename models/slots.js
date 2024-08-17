const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
