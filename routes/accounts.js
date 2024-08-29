const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { login, getProfile, updateProfile } = require("../controllers/accounts");
const router = express.Router();

router.route("/login").post(login);
router.route("/profile").get(authMiddleware, getProfile);
router.route("/update/:id").put(updateProfile);

module.exports = router;
