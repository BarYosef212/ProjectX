// const mongoose = require('mongoose');
// const data = require('./json.json');

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://shoes:1234Sagi@projectx.r2mox.mongodb.net/shoes')
//   .then(() => {
//     console.log('Connected to MongoDB');
    
//     // Insert data into MongoDB
//     const collection = mongoose.connection.collection('shoes');
//     console.log(data);
//     collection.insertMany(data).then(() => {
//       console.log('Data inserted successfully');
//       mongoose.connection.close();
//     }).catch((err) => {
//       console.error('Error inserting data:', err);
//     });
    
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });
