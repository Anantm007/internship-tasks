//jshint esversion: 8

const express = require("express");
const router = express.Router();
const { check, validationResult} = require("express-validator/");
const bodyParser = require('body-parser');


router.use(bodyParser());
// @route    GET api/products
// @desc     Get all products

router.get("/", async(req, res) => {

  try
  {
      const products = await Product.find();
      res.json(products);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
