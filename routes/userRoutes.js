const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

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
router.get("/usersAdmin",isAdmin, (req, res) => {
  res.render("usersAdmin");
});
router.get("/getUsers", isAdmin, userController.getAllUsers);
router.post("/usersAdmin", userController.findUser);

// Manage users
router.post("/delete-user", userController.deleteUser);
router.post("/toggle-admin", userController.toggleAdmin);
router.post("/toggle-marketing", userController.toggleMarketing);
router.post("/find-user", userController.findUser);


// Logout (GET and POST)

router.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
      return res.redirect("/"); // Redirect to home even if there's an error
    }

    // Successfully logged out, redirect to login page
    res.redirect("/login");
  });
});

module.exports = router;
