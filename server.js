require("dotenv").config({ path: "config/.env.local" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const branchRoutes = require("./routes/branchRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const { sessionMiddleware, setUserInView } = require("./middleware/auth");

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000; // Set port number with fallback

// Set view engine to ejs and specify views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB: ", error);
  }
}
connectDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Session and auth middleware
app.use(sessionMiddleware); // Middleware for sessions
app.use(setUserInView); // Middleware to set fullName in views

// Routes
app.use(userRoutes);
app.use(storeRoutes);
app.use(branchRoutes);
app.use(ordersRoutes);

// Catch 404 errors and render the error page
app.use((req, res) => {
  res
    .status(404)
    .render("errorHandler", { message: "Page not found", errorCode: 404 });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
