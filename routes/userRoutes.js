const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin,isLoggedOut } = require("../middleware/auth");
const userController = require('../controllers/user');
const { google } = require('googleapis');

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
router.get("/register", isLoggedOut,(req, res) => {
  res.render("register");
});
router.post("/register", userController.register);

// Login page
router.get("/login", isLoggedOut,(req, res) => {
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
router.post("/delete-user", isAdmin,userController.deleteUser);
router.post("/find-user", isAdmin,userController.findUser);
router.post("/updateUser",isAdmin,userController.updateUser);

// Logout
router.post("/logout", userController.logOut);

//getting data for the graphs 
router.get("/getMarketingData",userController.getMarketingData)
router.get("/auth/google/callback",userController.loginViaGoogle)
router.get('/auth/google', userController.initiateGoogleLogin); // Redirect to Google login URL
router.get('/auth/google/callback', userController.loginViaGoogle); // Handle Google login callback


//errorHandler
router.get("/error",(req,res)=>{
  res.render("errorHandler")
})

module.exports = router;
