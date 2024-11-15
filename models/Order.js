const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
    },
    orderFullName: {
      type: String,
      required: true,
    },
    userName:{
      type:String,
      required:true,
    }
  },

  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "shoes", // Reference to the Shoe model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      primaryImage: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  creditCard: {
    number: { type: String, required: true },
    cvv: { type: String, required: true },
    expirationDate: { type: String, required: true },
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
