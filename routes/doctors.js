const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { registration, getAllDoctors } = require("../controllers/doctors");
const router = express.Router();

router.route("/").post(registration);
router.route("/").get(getAllDoctors);

module.exports = router;
