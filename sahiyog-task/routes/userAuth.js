const express = require("express");
const router = express.Router();

// Authentication and validation
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const { stringify } = require("querystring");

// Environment Variables
require("dotenv").config();
const { JWTSECRET, CAPTCHASECRETKEY } = process.env;

// Express validation
const { check, validationResult } = require("express-validator");

// Models
const User = require("../models/User");

/*                                                  ROUTES                                                  */

// @route   POST /user/auth
// @desc    Register a new user
// @access  Public
router.post(
  "/",
  [
    // Validation
    check("name", "Name is required").not().isEmpty(),

    check("email", "Please include a valid email").isEmail(),

    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("../views/signup", { error: errors.array()[0].msg });
    }

    try {
      const { name, email, password, confirmPassword } = req.body;
      const captcha = req.body["g-recaptcha-response"];

      if (!captcha) {
        return res.render("../views/signup", {
          error: "Please fill out the captcha",
        });
      }

      // Verify URL
      const query = stringify({
        secret: CAPTCHASECRETKEY,
        response: captcha,
        remoteip: req.connection.remoteAddress,
      });

      const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

      // Make a request to verifyURL
      const body = await fetch(verifyURL).then((res) => res.json());

      // If not successful
      if (body.success !== undefined && !body.success) {
        return res.render("../views/signup", {
          error: "Sorry, there was an error in captcha, please try again later",
        });
      }

      if (password !== confirmPassword) {
        return res.render("../views/signup", {
          error: "Passwords don't match!",
        });
      }

      let user = await User.findOne({ email });

      // User already registered
      if (user) {
        return res.render("../views/signup", {
          error: "User already registered!",
        });
      }

      // Create new User
      user = new User({
        name,
        email,
        password,
      });

      // Encrypting the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save to database
      await user.save();

      // Payload for jwt
      const payload = {
        user: {
          id: user._id,
        },
      };

      // Signing the payload
      jwt.sign(payload, JWTSECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        return res.redirect(
          `/user/dashboard?token=${token}&name=${user.name}&email=${user.email}`
        );
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// @route   POST /user/auth/resetPassword/:resetToken
// @desc    Reset Password using token
// @access  Only for registered (user cannot be auth if he forgot his password)
router.post("/resetPassword", async (req, res) => {
  try {
    const { password, confirmPassword, oldPassword, email, name } = req.body;

    if (password !== confirmPassword) {
      return res.render("../views/dashboard", {
        error: "Passwords Don't match",
        name,
        email,
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.render("../views/dashboard", {
        error: "Invalid User",
        name,
        email,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.render("../views/dashboard", {
        error: "Current Password Incorrect",
        name,
        email,
      });
    }
    // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save new password to database
    await user.save();

    // Actually a success
    return res.render("../views/dashboard", {
      error: "Password Updated Succesfully!",
      name,
      email,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * NOT IN USE, FOR FUTURE REFERENE TO SEND FORGOT PASSWORD MAILS AND RESET
 */

// @route   POST /user/auth/forgot
// @desc    Forgot Password (send token)
// @access  Only for registered (user cannot be auth if he forgot his password)
router.post("/forgot", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with that email",
    });
  }

  // Generate and hash password token using crypto (to besent to the user)
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash it to store in the database
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Saving reset token and expires in the database
  await user.save();

  // Send reset password email
  const resetUrl = `${req.protocol}://localhost:3000/user/reset/password/${resetToken}`;

  // let HelperOptions = {
  //   from: process.env.EmailName + "<" + process.env.EmailId + ">",
  //   to: user.email,
  //   subject: "Password Reset",
  //   text: `Please click on the following link to reset your password: ${resetUrl}`,
  // };

  // transporter.sendMail(HelperOptions, (err, info) => {
  //   if (err) throw err;

  //   res.json({
  //     success: true,
  //     message: "Email sent successfully",
  //   });
  // });

  res.json({
    success: true,
    resetUrl,
  });
});

// @route   POST /user/auth/validToken
// @desc    Check whether token is valid or not
// @access  Only for registered (user cannot be auth if he forgot his password)
router.post("/validToken", async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Token",
    });
  }

  return res.status(200).json({
    success: true,
  });
});

module.exports = router;
