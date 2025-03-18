const express = require("express");
const {
  createSpeciality,
  getSpecialities,
  getSpecialtiesWithDoctorCount,
} = require("../controllers/speciality");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").post(createSpeciality);
router.route("/").get(getSpecialities);
router.route("/count").get(authMiddleware, getSpecialtiesWithDoctorCount);

module.exports = router;
