const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const userController = require('../controllers/user');

// Home page
router.get("/", (req, res) => {
  res.render("index");
});
router.get("/home", isLoggedIn, (req, res) => {
  res.render("index");
});

// Admin dashboard
router.get("/admin", isAdmin, (req, res) => {
  res.render("adminDashboard");
});

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", userController.register);

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", userController.login);

// Contact page
router.get("/contact", (req, res) => {
  res.render("contact");
});


// Users Admin page
router.get("/usersAdmin", isAdmin, (req, res) => {
  res.render("usersAdmin");
});
router.get("/getUsers", isAdmin, userController.getAllUsers);
router.post("/usersAdmin", userController.findUser);

// Manage users
router.post("/delete-user", userController.deleteUser);
router.post("/toggle-admin", userController.toggleAdmin);
router.post("/toggle-marketing", userController.toggleMarketing);
router.post("/find-user", userController.findUser);

// Logout
router.post("/logout", userController.logOut);

module.exports = router;
