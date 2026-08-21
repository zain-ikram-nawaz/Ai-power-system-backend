const express = require("express");
const { sendMessage } = require("../controllers/chatController");
const { chatValidator } = require("../validators/aiValidators");
const validateRequest = require("../middlewares/validateRequest");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/message", protect, chatValidator, validateRequest, sendMessage);

module.exports = router;
