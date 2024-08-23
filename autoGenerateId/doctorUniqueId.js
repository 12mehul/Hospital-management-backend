const ShortUniqueId = require("short-unique-id");
const Doctor = require("../models/doctors");

const uid = new ShortUniqueId({ length: 6, dictionary: "number" });

const doctorUniqueId = async (res) => {
  const rounds = await Doctor.countDocuments(); // Number of existing doctor records
  const uuidLength = 6; // Length of the UUID

  // Calculate collision probability
  const collisionProb = uid.collisionProbability(rounds, uuidLength);
  console.log(
    `Collision Probability after generating ${rounds} UUIDs: ${collisionProb}`
  );

  // If the collision probability is too high, adjust logic or alert
  if (collisionProb > 0.1) {
    return res.status(500).json({
      msg: "High probability of ID collision, consider increasing UUID length.",
    });
  }

  // Generate a new unique ID
  const shortId = uid.rnd();
  return shortId;
};

module.exports = doctorUniqueId;
