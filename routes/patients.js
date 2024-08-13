const express = require("express");
const {
  registration,
  login,
  getAllPatients,
  getProfile,
} = require("../controllers/patients");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getAllPatients);
router.route("/").post(registration);
router.route("/login").post(login);
router.route("/profile").get(authMiddleware, getProfile);

module.exports = router;
