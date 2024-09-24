const User = require('../models/user');
const { getShoes } = require('../controllers/shoes');
const bcrypt = require('bcryptjs');


//register function that saves the new user to the db with password hashed
async function register(firstName, lastName, email, password,passwordCompare){
  const saltRounds = 6;
  const hashedPassword = await bcrypt.hash(password,saltRounds);

  const userEmail = await User.findOne({email:email})
  
  if(userEmail){
    throw new Error("User with this email already registered")
  }  

  if(password !== passwordCompare){
    throw new Error("Password do not match");
  }

  if(password.length<6){
    throw new Error("Passowrd must be at least 6 digits");
  }

  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  if(!regex.test(password)){
    throw new Error(`Password must contain !@#$%^&*(),.?":{}|<>`)
  }
  const admin = false;
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    admin
  });
  console.log("User registerd")

  await user.save(); 
}
// login function that find the user ing the db and validate the given password with the password stored in the db
async function login(email,password){
  const user = await User.findOne({email:email});
  if(user && await bcrypt.compare(password,user.password)){
    return user;
  }
  throw new Error("Invalid email or password");
}



module.exports = {register,login};