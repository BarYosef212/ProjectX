const express = require ('express'); // Import library express (npm install express)
const path = require ('path'); // Import library path (access to file system)
const shoesRoutes = require ('./routes/shoesRoutes'); // Import file shoesStore.js

const mongoose = require ('mongoose'); // Import library mongoose (connect to MongoDB) (npm install mongoose)
const app = express(); // Create an express application
const PORT = 3000; // Port number

app.set('view engine', 'ejs'); // Set view engine to ejs  (npm install ejs)
app.set('Pages', path.join(__dirname, 'Pages')); // Set Pages to the Pages folder

async function connectDB(){ // Connect to MongoDB
  try{
    await mongoose.connect('mongodb://localhost:27017/shoesDB', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to MongoDB'); // If connected to MongoDB, print this message
  }
  catch(error){
    console.error("Failed to connect mongoDB: ", error);// If failed to connect to MongoDB, print this message
  }
}

connectDB(); // Call the function connectDB

app.use(express.static(path.join(__dirname, 'public'))); // Use the public folder

app.use(shoesRoutes)// Use the shoesRoutes

app.listen(PORT, () => { // Listen to the port
  console.log(`Server is running on http://localhost:${PORT}`); // If the server is running, print this message
});
