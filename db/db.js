const mongoose = require("mongoose");

const connectToDB = async (url) => {
  await mongoose
    .set("strictQuery", false)
    .connect(url)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
};

module.exports = connectToDB;
