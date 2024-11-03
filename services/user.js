const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (firstName, lastName, email, password, marketing,googleId) => {
  const saltRounds = 6;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  marketing = marketing == "on" ? true : false;
  let admin = false;
  //middleware
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    googleId,
    marketing,
    admin,
  });
  if (user) {
    await user.save();
    if(googleId!=="0") console.log("Google user registerd")
    else console.log("User registered")
    return user;
  } else {
    return null;
  }
};
exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  else{
    return null
  }
};

exports.findUser = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return user;
  } else {
    return null;
  }
};

exports.getAllUsers = async () => {
  const users = await User.find().sort({ _id: -1 });
  if (users) {
    return users;
  } else {
    throw new Error("No users found");
  }
};

exports.deleteUser = async (email) => {
  let user = await User.findOne({ email: email });
  const countAdmins = await exports.countAdmins();
  if (countAdmins == 1 && user.admin === true) return 0;
  else {
    
    const result = await User.deleteOne({ email: email });
    if (result.deletedCount === 1) {
      return 1;
    } else {
      throw new Error("Error in delete user");
    }
  }
};

exports.countAdmins = async (req, res) => {
  const adminsCount = await User.countDocuments({ admin: true });
  return adminsCount;
};

exports.updateUser = async (email,updatedData) =>{
  if(updatedData.password){
    const saltRounds = 6;
    updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);
  }

  const updatedUser = await User.findOneAndUpdate({ email: email }, updatedData, {
    new: true,
  });
  if (updatedUser) return updatedUser;
  else return null;
}