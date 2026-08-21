const express = require("express");
const { register, login, logout, getProfile } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidators");
const validateRequest = require("../middlewares/validateRequest");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

module.exports = router;
