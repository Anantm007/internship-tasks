//jshint esversion: 6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeletedSchema = new Schema({

    old_id: {
        type: String,
        required: true
    },

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

module.exports = Deleted = mongoose.model('deleted', DeletedSchema);
