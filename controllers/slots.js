const moment = require("moment");
const Slot = require("../models/slots");

const createSlot = async (req, res) => {
  try {
    const { date, time, doctorId } = req.body;
    // Format the time using moment
    const formattedTime = moment(time, ["h:mm A"]).format("hh:mm A");
    await Slot.create({ date, time: formattedTime, doctorId });
    res.status(201).json({ msg: "Slots created successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSlots = async (req, res) => {
  try {
    const { doctorId } = req.query;

    Slot.aggregate([
      { $match: { doctorId } },
      // First stage: Compute formattedDate and convertedTime
      {
        $project: {
          _id: 1,
          doctorId: 1,
          date: 1,
          time: 1,
          isAvailable: 1,
          formattedDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          // Convert AM/PM time to 24-hour format
          convertedTime: {
            $let: {
              vars: {
                timeParts: { $split: ["$time", " "] }, // Split time and AM/PM
                hourMinute: { $substr: ["$time", 0, 5] }, // Extract 'hh:mm'
              },
              in: {
                $let: {
                  vars: {
                    hour: { $toInt: { $substr: ["$$hourMinute", 0, 2] } },
                    minute: { $substr: ["$$hourMinute", 3, 2] },
                    ampm: { $arrayElemAt: ["$$timeParts", 1] },
                  },
                  in: {
                    $cond: [
                      { $eq: ["$$ampm", "PM"] },
                      {
                        $concat: [
                          {
                            $toString: {
                              $cond: [
                                { $eq: ["$$hour", 12] },
                                12,
                                { $add: ["$$hour", 12] },
                              ],
                            },
                          },
                          ":",
                          "$$minute",
                        ],
                      },
                      {
                        $concat: [
                          {
                            $toString: {
                              $cond: [
                                { $eq: ["$$hour", 12] },
                                "00",
                                {
                                  $cond: [
                                    { $lt: ["$$hour", 10] },
                                    { $concat: ["0", { $toString: "$$hour" }] },
                                    { $toString: "$$hour" },
                                  ],
                                },
                              ],
                            },
                          },
                          ":",
                          "$$minute",
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      // Second stage: Combine formattedDate and convertedTime
      {
        $sort: {
          formattedDate: 1,
          convertedTime: 1,
        },
      },
      {
        $project: {
          doctorId: 1,
          date: 1,
          time: 1,
          isAvailable: 1,
          // formattedDate: 1,
          // convertedTime: 1,
          combinedDateTime: {
            $concat: [
              "$formattedDate",
              " ",
              { $ifNull: ["$convertedTime", "Invalid Time"] },
            ],
          },
        },
      },
    ])
      .exec()
      .then((slots) => {
        res.status(200).json({ slots });
      });
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
