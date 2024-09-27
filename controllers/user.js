const userService = require("../services/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCompare,marketing } = req.body;
    await userService.register(
      firstName,
      lastName,
      email,
      password,
      passwordCompare,
      marketing
    );
    const user =  await userService.login(email,password)
    req.session.userId = user._id;
    req.session.fullName = `${user.firstName} ${user.lastName}`;
    res.redirect("/");
  } catch (error) {
    console.log("error");
    res.render("register", { error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    if (user) {
      req.session.userId = user._id;
      req.session.fullName = `${user.firstName} ${user.lastName}`;
    }
      res.redirect("/home");
      res.render('index')
    
  } catch (error) {
    console.log("errorLogin",error);
    res.render("login", { error: error.message });
  }
};

exports.renderHomePage = (req, res) => {
  res.render('index');
};

