const express = require("express");
const { generateContent } = require("../controllers/aiController");
const { generateValidator } = require("../validators/aiValidators");
const validateRequest = require("../middlewares/validateRequest");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateValidator, validateRequest, generateContent);

module.exports = router;
