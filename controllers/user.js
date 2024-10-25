const userService = require("../services/user");
const User = require("../models/user");
const errorMessage = "An error occured, please try again later";

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
        message: `${users.length} users found`,
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

exports.toggleAdmin = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const result = await userService.toggleAdmin(userEmail);
    if (result && result !== 1) {
      res.json({
        message: "Permissions changed successfully",
        admin: result.admin,
      });
    } else if (result === 1) {
      res.status(403).json({
        message: "1 Admin left, cannot change permmissions",
      });
    } else {
      return res.status(404).json({
        message: "An error occurred while updating user's permissions",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.toggleMarketing = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const result = await userService.toggleMarketing(userEmail);
    if (result) {
      res.json({
        message: "Preferences changed successfully",
        marketing: result.marketing,
      });
    } else {
      res.status(404).json({
        message: "An error occured, please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.renderUsersPage = async (req, res) => {
  const users = await userService.getAllUsers();
  if (users.length > 0) {
    res.render("usersAdmin", { users });
  } else {
    const error = new Error("No users found");
    res.render("usersAdmin", {
      users,
      error: error.message,
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
