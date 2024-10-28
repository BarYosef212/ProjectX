const userService = require("../services/user");
const User = require("../models/user");
const errorMessage = "An error occured, please try again later";
const mongoose = require('mongoose');


// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(`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`);

// function sendWelcomeEmail(toEmail, userName) {
//     const msg = {
//         to: toEmail,
//         from: "BARTAYAR123456789@GMAIL.COM", // Your SendGrid verified sender
//         subject: 'Welcome to Our Website!',
//         text: `Hello ${userName},\n\nThank you for registering!\n\n `,
//     };

//     sgMail.send(msg).then(() => {
//         console.log('Email sent');
//     }).catch((error) => {
//         console.error('Error sending email:', error);
//     });
// }




exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCompare, marketing } =
      req.body;
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      res.status(409).json({
        message: "User with this email already registered",
      });
    } else {
      await userService.register(
        firstName,
        lastName,
        email,
        password,
        passwordCompare,
        marketing
      );
      const user = await userService.login(email, password);
      req.session.userId = user._id;
      req.session.fullName = `${user.firstName} ${user.lastName}`;
      req.session.admin = user.admin;
      res.json({
        message: "User registered successfully",
      });
    }
  } catch (error) {
    console.log("Error in register: ", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    if (user) {
      req.session.userId = user._id;
      req.session.fullName = `${user.firstName} ${user.lastName}`;
      req.session.admin = user.admin;
      res.json({
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log("errorLogin", error);
    res.render("login", { errorCode: error.code, error: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (userEmail === "") {
      const users = await userService.getAllUsers();
      res.json({
        user: users,
        array: true,
      });
    } else {
      const user = await userService.findUser(userEmail);
      if (user) {
        res.json({
          user: user,
          array: false,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    }
  } catch (error) {
    console.log("Error in findUser: ", error.message);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length > 0) {
      res.json({
        users: users,
      });
    } else {
      return res.status(404).json({
        message: "No users found",
      });
    }
  } catch (error) {
    console.log("Error in getAllUsers: ", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const deleteCount = await userService.deleteUser(userEmail);

    if (deleteCount === 1) {
      res.json({
        message: "User deleted successfully",
      });
    } else if (deleteCount === 0) {
      res.status(403).json({
        message: "1 Admin left, cannot delete last admin",
      });
    } else {
      return res.status(404).json({
        message: "User not found or already deleted.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};

exports.updateUser = async (req, res) => {
  const { email, updatedData } = req.body;
  if (updatedData.email) {
    const userToCheck = await User.findOne({ email: updatedData.email });
    if (userToCheck) {
      return res.status(409).json({
        message: "User with this email already exist",
      });
    }
  }

  if(updatedData.admin === false){
    const adminsCount = await userService.countAdmins();
    if(adminsCount===1){
      return res.status(403).json({
        message: "1 Admin left, cannot change role"
      });
    }
  }

  const user = await userService.updateUser(email, updatedData);
  if (user) {
    return res.json({
      message: "User updated successfully",
      user: user,
    });
  } else {
    return res.status(403).json({
      message: errorMessage,
    });
  }
};
