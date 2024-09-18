const express = require("express"); // Import library express (npm install express)
const mongoose = require("mongoose"); // Import library mongoose (connect to MongoDB) (npm install mongoose)

const bodyParser = require('body-parser'); 
const path = require("path"); // Import library path (access to file system)
const homePage = require("./routes/indexRoutes"); // Import file indexRoutes.js
const storeRoutes = require("./routes/storeRoutes"); // Import file shoesStore.js
const contactRoutes = require("./routes/contactRoutes"); // Import file contactRoutes.js
const SignUpRoutes = require("./routes/SignUpRoutes");
const authRoutes = require("./routes/authRoutes");
const { Sign } = require("crypto");

// const { get } = require("http");
const app = express(); // Create an express application
const PORT = 3000; // Port number

app.set("view engine", "ejs"); // Set view engine to ejs  (npm install ejs)
app.set("views", path.join(__dirname, "views")); // Set Pages to the Pages folder

async function connectDB() {
  // Connect to MongoDB
  try {
    await mongoose.connect(
      "mongodb+srv://shoes:1234Sagi@projectx.r2mox.mongodb.net/shoes"
    );
    console.log("Connected to MongoDB"); // If connected to MongoDB, print this message
  } catch (error) {
    console.error("Failed to connect mongoDB: ", error); // If failed to connect to MongoDB, print this message
  }
}

connectDB(); // Call the function connectDB

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, "public"))); // Use the public folder

app.use(homePage); // Use the shoesRoutes
app.use(contactRoutes); // Use the contactRoutes
// server.js
app.use(storeRoutes); // Use the storeRoutes for the /store path
app.use(authRoutes);
app.use(SignUpRoutes);



app.listen(PORT, () => {
  // Listen to the port
  console.log(`Server is running on http://localhost:${PORT}`); // If the server is running, print this message
});
