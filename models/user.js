const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema
const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  marketing: {
    type: Boolean,
    required: true,
  },
  admin:{
   type:Boolean,
   required:true,
  },
},
{versionKey: false});


module.exports = mongoose.model("users", user);
