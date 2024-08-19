const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
