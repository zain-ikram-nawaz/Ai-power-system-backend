const History = require("../models/History");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/ApiResponse");
const { chatWithTutor } = require("../services/geminiService");

const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversation = [] } = req.body;

  const reply = await chatWithTutor(message, conversation);

  const history = await History.create({
    userId: req.user._id,
    input: message,
    outputType: "chat",
    response: reply,
  });

  sendResponse(res, 201, { reply, history }, "Message sent successfully");
});

module.exports = { sendMessage };
