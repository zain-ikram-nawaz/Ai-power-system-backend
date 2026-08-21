const History = require("../models/History");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/ApiResponse");
const { generateSummary, generateExplanation, generateQuiz } = require("../services/geminiService");

const generators = {
  summary: generateSummary,
  explanation: generateExplanation,
  quiz: generateQuiz,
};

const generateContent = asyncHandler(async (req, res) => {
  const { input, outputType } = req.body;

  const response = await generators[outputType](input);

  const history = await History.create({
    userId: req.user._id,
    input,
    outputType,
    response,
  });

  sendResponse(res, 201, { history }, "Content generated successfully");
});

module.exports = { generateContent };
