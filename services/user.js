const User = require("../models/user");
const bcrypt = require("bcryptjs");

//register function that saves the new user to the db with password hashed
exports.register = async (
  firstName,
  lastName,
  email,
  password,
  passwordCompare,
  marketing
) => {
  const saltRounds = 6;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userEmail = await User.findOne({ email: email });

  if (userEmail) {
    const error = new Error(`User with this email already registered`);
    error.code = 107;
    throw error;
  }

  if (password !== passwordCompare) {
    const error = new Error(`Password do not match`);
    error.code = 106;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error(`Passowrd must be at least 6 digits`);
    error.code = 105;
    throw error;
  }

  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!regex.test(password)) {
    const error = new Error(`Password must contain !@#$%^&*(),.?":{}|<>`);
    error.code = 104;
    throw error;
  }
  marketing = marketing == "on" ? true : false;
  let admin = false;
  if(email==="bartayar123456789@gmail.com") admin = true
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    marketing,
    admin,
  });
  console.log("User registerd");

  await user.save();
};
// login function that find the user ing the db and validate the given password with the password stored in the db
exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  const error = new Error("Invalid email or password");
  error.code = 103;
  throw error;
};

exports.findUser = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    console.log(`User found: ${user.firstName} ${user.lastName}`);
    return user;
  } else {
    return null;
  }
};

exports.getAllUsers = async () => {
  const users = await User.find();
  if (users) {
    return users;
  } else {
    const error = new Error("No users found");
    error.code = 101;
    console.log("error no users")
    throw error;
  }
};

exports.deleteUser = async(email) =>{
    const result = await User.deleteOne({email:email})
    if(result.deletedCount === 1){
      return 1;
    }
    else{
      const error = new Error("Error in delete user");
      error.code = 108;
      throw error;
    }
}

exports.toggleAdmin = async(email)=>{
  const result = await User.updateOne(
    { email: email },  // Find the user by email
    [
      { 
        $set: { 
          admin: { $cond: { if: { $eq: ["$admin", true] }, then: false, else: true } } 
        }
      }
    ]
  );

  if(result.modifiedCount!==0){
    return 1;
  }
  else{
    const error = new Error("Problem with permissions");
    error.code = 109;
    throw error;
  }
}

exports.toggleMarketing = async(email)=>{
  const result = await User.updateOne(
    { email: email },  // Find the user by email
    [
      { 
        $set: { 
          marketing: { $cond: { if: { $eq: ["$marketing", true] }, then: false, else: true } } 
        }
      }
    ]
  );

  if(result.modifiedCount!==0){
    return 1;
  }
  else{
    const error = new Error("Problem with change marketing value");
    error.code = 110;
    throw error;
  }
}



