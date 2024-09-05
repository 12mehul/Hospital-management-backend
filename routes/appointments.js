const express = require("express");
const {
  bookAppointment,
  getAppointments,
} = require("../controllers/appointments");
const router = express.Router();

router.route("/").post(bookAppointment);
router.route("/").get(getAppointments);

module.exports = router;
