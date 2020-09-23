//jshint esversion: 8

const express = require("express");
const router = express.Router();
const { check, validationResult} = require("express-validator/");
const bodyParser = require('body-parser');
const Product = require("../../models/Product");

router.use(bodyParser());


router.post('/:id',

  async (req, res) => {

      const productFields = {};
      productFields.id = req.params.id;

      const {category, name, brand, price, discount, in_stock, imageUrl} = req.body;

      if(name)
      productFields.name = name;

      if(category)
      productFields.category = category;

      if(brand)
      productFields.brand = brand;

      if(discount)
      productFields.discount = discount;

      if(price)
      productFields.price = price;

      if(in_stock)
      productFields.in_stock = in_stock;

      if(imageUrl)
      productFields.imageUrl = imageUrl;

    try {
      let product = await Product.findById(req.params.id);

      // Update
        product = await Product.findOneAndUpdate({ _id: req.params.id},
        {$set: productFields}, {new: true}, function(err, result)
      {
        if(err)
        console.log(err);
      });

        await product.save();

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
