const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/ApiResponse");
const { generateToken, setTokenCookie, clearTokenCookie } = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  sendResponse(res, 201, { user, token }, "Registration successful");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  sendResponse(res, 200, { user, token }, "Login successful");
});

const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  sendResponse(res, 200, null, "Logged out successfully");
});

const getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, { user: req.user }, "Profile fetched successfully");
});

module.exports = { register, login, logout, getProfile };
