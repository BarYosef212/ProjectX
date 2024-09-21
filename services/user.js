const userService = require('../services/user');
const User = require('../models/user');
const { getShoes } = require('../controllers/shoes');
const bcrypt = require('bcrypt');


//register function that saves the new user to the db with password hashed
async function register(firstName, lastName, email, password){
  const saltRounds = 6;
  const hashedPassword = await bcrypt.hash(password,saltRounds);

  const userEmail = await User.find({email})
  console.log(userEmail)
  
  if(userEmail==[]){
    return new Error("User with this email already registered")
  }  

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  await user.save(); 
}

// login function that find the user ing the db and validate the given password with the password stored in the db
async function login(email,password){
  const user = await User.findOne({email});
  if(user && await bcrypt.compare(password,user.password)){
    return user;
  }
  return null;
}

module.exports = {register,login};