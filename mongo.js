const mongoose = require('mongoose');
const data = require('./data.json');
const url = 'https://v1-sneakers.p.rapidapi.com/v1/sneakers?limit=99';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'f3f61ff162mshe7aefb390473283p16c9b1jsna80643caf5d1',
      'x-rapidapi-host': 'v1-sneakers.p.rapidapi.com'
    }
  };




const connectAndInsert = async () => { 
  let result;
  console.log('Connecting to API and MongoDB...');
  //Retrieve data from API
  try {
    const response = await fetch(url, options);
    result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  //Connect to MongoDB
  mongoose.connect('mongodb+srv://shoes:1234Sagi@projectx.r2mox.mongodb.net/shoes')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Insert data into MongoDB
    const collection = mongoose.connection.collection('shoes');
    collection.insertMany(result.results).then(() => {
      console.log('Data inserted successfully');
      mongoose.connection.close();
    }).catch((err) => {
      console.error('Error inserting data:', err);
    });
    
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
}

connectAndInsert();

