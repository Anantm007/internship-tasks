// Utils
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { JWTSECRET } = process.env;

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.query.token;

  // Check if invalid token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWTSECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Please log out and login again",
    });
  }
};
