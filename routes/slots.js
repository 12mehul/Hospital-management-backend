const express = require("express");
const { createSlot, getSlots } = require("../controllers/slots");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").post(createSlot);
router.route("/").get(authMiddleware, getSlots);

module.exports = router;
