const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Shoe schema
const shoeSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId, // Use MongoDB's default ID
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


module.exports = mongoose.model('Shoe', shoeSchema, 'shoes'); // Use 'shoes' as the collection name
 // Export the model for use in other parts of your application
