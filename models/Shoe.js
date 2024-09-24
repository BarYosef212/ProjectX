const mongoose = require('mongoose');

// Define the Shoe schema
const shoeSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  colorway: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  shoe: {
    type: String,
    required: true
  },
  styleId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  primaryImage: {
    type: String,
    required: true
  },
  price: {
    numberInt: {
      type: Number,
      required: true
    }
  }
});


module.exports = mongoose.model("shoes",shoeSchema); 
