const express = require("express");
const {
  bookAppointment,
  getAppointments,
} = require("../controllers/appointments");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").post(authMiddleware, bookAppointment);
router.route("/").get(authMiddleware, getAppointments);

module.exports = router;
