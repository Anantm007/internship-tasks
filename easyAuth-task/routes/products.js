const express = require("express");
const router = express.Router();

// Express validation
const { check, validationResult } = require("express-validator");

// Models
const Product = require("../models/Product");

/*                                                  ROUTES                                                  */

// @route   GET /api/products
// @desc    List all Products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).select(
      "name image price aggregateRating"
    );

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get a particular Product
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route   POST /api/products
// @desc    Create a new Product
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").exists(),
    check("description", "Description is required").exists(),
    check("image", "Image link is required").exists(),
    check("price", "Price is required").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const product = new Product(req.body);

      await product.save();

      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// @route   POST /api/products/reviews/:id
// @desc    Add a Review
// @access  Public
router.post(
  "/reviews/:id",
  [
    check("name", "Name is required").exists(),
    check("rating", "Tating is required").isNumeric(),
    check("comments", "Comments link is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      let product = await Product.findById(req.params.id).select(
        "_id reviews aggregateRating"
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.reviews.unshift(req.body);
      product.aggregateRating += req.body.rating;

      await product.save();

      return res.status(201).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Edit a Product
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).select("_id");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newDetails = req.body;

    product = await Product.findByIdAndUpdate(req.params.id, newDetails, {
      new: true,
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route   Delete /api/products/:id
// @desc    Delete a Product
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).select("_id");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(204).json({ message: "Product deleted succesfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
