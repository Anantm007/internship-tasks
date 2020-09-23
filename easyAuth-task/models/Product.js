const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
        comments: {
          type: String,
        },
      },
    ],
    aggregateRating: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
