const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (firstName, lastName, email, password, marketing) => {
  const saltRounds = 6;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  marketing = marketing == "on" ? true : false;
  let admin = false;
  //middleware
  if (email === "bartayar123456789@gmail.com") admin = true;

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    marketing,
    admin,
  });
  if (user) {
    await user.save();
    console.log("User registerd");
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
  const users = await User.find();
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

exports.toggleAdmin = async (email) => {
  let user = await User.findOne({ email: email });
  const countAdmins = await exports.countAdmins();
  if (countAdmins == 1 && user.admin === true) return 1;
  const result = await User.updateOne(
    { email: email }, // Find the user by email
    [
      {
        $set: {
          admin: {
            $cond: { if: { $eq: ["$admin", true] }, then: false, else: true },
          },
        },
      },
    ]
  );
  user = await User.findOne({ email: email });

  if (result.modifiedCount !== 0) {
    return user;
  } else {
    throw new Error("Problem with permissions");
  }
};

exports.toggleMarketing = async (email) => {
  const result = await User.updateOne(
    { email: email }, // Find the user by email
    [
      {
        $set: {
          marketing: {
            $cond: {
              if: { $eq: ["$marketing", true] },
              then: false,
              else: true,
            },
          },
        },
      },
    ]
  );
  const user = await User.findOne({ email: email });

  if (result.modifiedCount !== 0) {
    return user;
  } else {
    throw new Error("Problem with preferences");
  }
};
