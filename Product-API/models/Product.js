//jshint esversion: 6

const mongoose = require("mongoose");
const multer = require('multer');


const ProductSchema = new mongoose.Schema({

  category: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  discount: {
    type: Number,
    required: true
  },

  in_stock: {
    type: Boolean,
    required: true
  },

  imageUrl: {
     data: Buffer,
     contentType: String
  }
});


module.exports = Product = mongoose.model('product', ProductSchema);
