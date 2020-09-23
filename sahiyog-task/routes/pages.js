const express = require("express");
const router = express.Router();

// Middleware for protecting routes
const auth = require("../middleware/userAuth");

// @route   GET /
// @desc    Render Signin Page
// @access  Public
router.get("/", async (req, res) => {
  try {
    if (req.user) {
      return res.redirect("/user/dashboard");
    }

    return res.render("../views/signin", { error: "" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route   GET /
// @desc    Render Signup Page
// @access  Public
router.get("/signup", async (req, res) => {
  try {
    if (req.user) {
      return res.redirect("/user/dashboard");
    }

    return res.render("../views/signup", { error: "" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
