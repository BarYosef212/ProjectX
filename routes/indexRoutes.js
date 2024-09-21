const express = require('express');
const router = express.Router();

// Define the route for the index page
router.get('/', (req, res) => {
    const message = req.query.message;  // Get message from query parameter or set to empty string
    res.render('index', { message });  // Pass message to the template
  });
  

module.exports = router;