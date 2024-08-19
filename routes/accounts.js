const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { login, getProfile } = require("../controllers/accounts");
const router = express.Router();

router.route("/login").post(login);
router.route("/profile").get(authMiddleware, getProfile);

module.exports = router;
