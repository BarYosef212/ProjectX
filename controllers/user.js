const userService = require("../services/user");
const User = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCompare, marketing } =
      req.body;
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
    res.render("register", { message: "User registered successfully!" });
  } catch (error) {
    console.log("error");
    res.render("register", { errorCode: error.code, error: error.message });
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
    }
    res.render("login", { message: "Login Successful" });
  } catch (error) {
    console.log("errorLogin", error);
    res.render("login", { errorCode: error.code, error: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { emailUsersForm } = req.body;
    const email = emailUsersForm;
    if (email === "") {
      await exports.renderUsersPage(req, res);
    } else {
      const searchedUser = await userService.findUser(email);
      const users = await userService.getAllUsers();

      if (searchedUser) {
        res.render("users", { users: [searchedUser] });
      } else {
        res.render("users", { users, errorCode: 102, error: "User not found" });
      }
    }
  } catch (error) {
    console.log("Error in findUser: ", error.message);
    res.render("users", { errorCode: error.code || 500, error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (users) return users;
    else return null;
  } catch (error) {
    console.log("Error in getAllUsers: ", error);
    res.render("users", { errorCode: error.code, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const deleteCount = await userService.deleteUser(userEmail);
    if (deleteCount === 1) {
      const message = {
        message: "User deleted successfully!",
        code: 1,
      };
      const users = await exports.getAllUsers();
      res.render("users", {
        users,
        messageCode: message.code,
        message: message.message,
      });
    }
  } catch (error) {
    res.render("users", { errorCode: error.code, error: error.message });
  }
};

exports.toggleAdmin = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const result = await userService.toggleAdmin(userEmail);
    if(result === 1){
      const message = {
        message: "Permissions changed successfully!",
        code: 2,
      };
      const users = await exports.getAllUsers();
      res.render("users", {
        users,
        messageCode: message.code,
        message: message.message,
      });
    }
  } catch (error) {
    const users = await exports.getAllUsers();
    res.render("users", {users,errorCode: error.code, error: error.message });
  }
};

exports.toggleMarketing = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const result = await userService.toggleMarketing(userEmail);

    if(result === 1){
      const message = {
        message: "Preferences changed successfully!",
        code: 3,
      };
      const users = await exports.getAllUsers();
      res.render("users", {
        users,
        messageCode: message.code,
        message: message.message,
      });
    }
  } catch (error) {
    const users = await exports.getAllUsers();
    res.render("users", {users,errorCode: error.code, error: error.message });
  }
};

exports.renderUsersPage = async (req, res) => {
  const users = await exports.getAllUsers(req, res);
  if (users.length>0) {
    res.render("users", { users });
  } else {
    const error = new Error("No users found");
    error.code = 101;
    const users = []
    res.render("users", {users,errorCode: error.code, error: error.message });
  }
};

exports.renderHomePage = (req, res) => {
  res.render("index");
};
