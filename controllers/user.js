const userService = require("../services/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCompare } = req.body;
    await userService.register(
      firstName,
      lastName,
      email,
      password,
      passwordCompare
    );
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
    console.log("the user:", user);
    if (user) {
      res.redirect("/");
    }
  } catch (error) {
    console.log("errorLogin",error);
    res.render("login", { error: error.message });
  }
};

exports.renderHomePage = (req, res) => {
  res.render('index');
};

