const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  registration,
  getAllPatients,
  searchPatient,
} = require("../controllers/patients");
const router = express.Router();

router.route("/").post(registration);
router.route("/").get(authMiddleware, getAllPatients);
router.route("/search").get(authMiddleware, searchPatient);

module.exports = router;
