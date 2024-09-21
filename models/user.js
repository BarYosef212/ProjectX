const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Define the User schema
const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
     type: String,
     required: true,
     unique: true,
     match: [/.+\@.+\..+/, 'Please enter a valid email address']
     },
  password: { 
   type: String,
   required: true,
   match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'] }
});

module.exports = mongoose.model('users', user);
