const History = require("../models/History");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/ApiResponse");

const getHistory = asyncHandler(async (req, res) => {
  const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
  sendResponse(res, 200, { history }, "History fetched successfully");
});

const deleteHistoryItem = asyncHandler(async (req, res) => {
  const item = await History.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!item) {
    throw new ApiError(404, "History item not found");
  }

  sendResponse(res, 200, null, "History item deleted successfully");
});

const deleteAllHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({ userId: req.user._id });
  sendResponse(res, 200, null, "All history deleted successfully");
});

module.exports = { getHistory, deleteHistoryItem, deleteAllHistory };
