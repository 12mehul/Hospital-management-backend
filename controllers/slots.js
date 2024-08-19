const Slot = require("../models/slots");

const createSlot = async (req, res) => {
  try {
    const { date, time, doctorId } = req.body;
    await Slot.create({ date, time, doctorId });
    res.status(201).json({ msg: "Slots created successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSlots = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const slots = await Slot.find({ doctorId });
    res.status(200).json({ slots });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const slotsDateUpdate = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Find slots that are exactly scheduled for yesterday
    const slots = await Slot.find({ date: { $eq: yesterday } });

    slots.forEach(async (slot) => {
      // Increment the date by 1 day
      const newDate = new Date(slot.date);
      newDate.setDate(newDate.getDate() + 1);
      // Update the slot with the new date
      slot.date = newDate;
      await slot.save();
    });
    res.status(200).json({ msg: "Slots updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createSlot,
  getSlots,
  slotsDateUpdate,
};
