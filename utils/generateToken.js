const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const setTokenCookie = (res, token) => {
  const maxAge = parseInt(process.env.COOKIE_MAX_AGE_MS, 10) || 7 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: maxAge,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

module.exports = { generateToken, setTokenCookie, clearTokenCookie };