const express = require("express");
const { createSlot, getSlots } = require("../controllers/slots");
const router = express.Router();

router.route("/").post(createSlot);
router.route("/").get(getSlots);

module.exports = router;
