const mongoose = require("mongoose");

// Define the User schema
const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: false,
    match: [/.+\@.+\..+/],
  },
  password: {
    type: String,
    required: true,
  },
  googleId: { type: String, unique: true },
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
