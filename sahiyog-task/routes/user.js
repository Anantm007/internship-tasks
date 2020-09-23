const express = require("express");
const router = express.Router();

// Middleware for protecting routes
const auth = require("../middleware/userAuth");

// Password encryption
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment Variables
require("dotenv").config();
const { JWTSECRET } = process.env;

// Express validation
const { check, validationResult } = require("express-validator");

// Models
const User = require("../models/User");

/*                                                  ROUTES                                                  */

// @route   GET /user/dashboard
// @desc    Render Dashboard
// @access  Private
router.get("/dashboard", auth, async (req, res) => {
  try {
    return res.render("../views/dashboard", {
      error: "",
      email: req.query.email,
      name: req.query.name,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route   POST /user
// @desc    Authenticate (login) user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("../views/signin", { error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.render("../views/signin", { error: "Invalid Credentails" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("../views/signin", { error: "Invalid Credentails" });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, JWTSECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        // Do not send this to the client
        user.password = undefined;

        return res.redirect(
          `/user/dashboard?token=${token}&name=${user.name}&email=${user.email}`
        );
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  }
);

// @route   GET /user/signout
// @desc    Log the user out
// @access  Only for authenticated users
router.get("/signout", async (req, res) => {
  try {
    req.user = undefined;

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
