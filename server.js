require('dotenv').config({ path: 'config/.env.local' });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require("path");
const { sessionMiddleware, isLoggedIn, setUserInView } = require('./middleware/auth');  // Import auth middlewares
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");

const app = express(); // Create an express application
const PORT = process.env.PORT; // Port number

app.set("view engine", "ejs"); // Set view engine to ejs  (npm install ejs)
app.set("views", path.join(__dirname, "views")); // Set Pages to the Pages folder

async function connectDB() {
  try {
    await mongoose.connect(
      process.env.DB_CONNECTION_STRING
    );
    console.log("Connected to MongoDB"); 
  } catch (error) {
    console.error("Failed to connect mongoDB: ", error); 
  }
}
connectDB();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public"))); 

// Use session middleware and setUserInView before defining any routes
app.use(sessionMiddleware);  // Middleware for sessions
app.use(setUserInView);      // Middleware to set fullName in views

// Routes
app.use(userRoutes);
app.use(storeRoutes);

// Example protected route (home page)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`); 
});
