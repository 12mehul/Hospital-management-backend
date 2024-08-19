const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { registration, getAllPatients } = require("../controllers/patients");
const router = express.Router();

router.route("/").post(registration);
router.route("/").get(getAllPatients);

module.exports = router;
