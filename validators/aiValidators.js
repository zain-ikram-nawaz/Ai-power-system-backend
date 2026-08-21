const { body } = require("express-validator");

const generateValidator = [
  body("input")
    .trim()
    .isLength({ min: 5, max: 3000 })
    .withMessage("Input must be between 5 and 3000 characters"),
  body("outputType")
    .isIn(["summary", "explanation", "quiz"])
    .withMessage("outputType must be one of: summary, explanation, quiz"),
];

const chatValidator = [
  body("message")
    .trim()
    .isLength({ min: 1, max: 3000 })
    .withMessage("Message must be between 1 and 3000 characters"),
];

module.exports = { generateValidator, chatValidator };
