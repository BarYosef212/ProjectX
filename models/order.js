const mongoose = require('mongoose');

// Define Order schema and model
const orderSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    totalAmount: Number,
    date: Date
  });
  
  module.exports = mongoose.model('order', orderSchema);

  