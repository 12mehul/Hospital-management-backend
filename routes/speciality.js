const express = require("express");
const {
  createSpeciality,
  getSpecialities,
} = require("../controllers/speciality");
const router = express.Router();

router.route("/").post(createSpeciality);
router.route("/").get(getSpecialities);

module.exports = router;
