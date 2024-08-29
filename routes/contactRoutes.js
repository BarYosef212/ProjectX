const express = require('express');
const router = express.Router();

// Define the route for the index page
router.get('/contact', (req, res) => {
    // Render the index.ejs template located in the Pages folder
    res.render('contact', { title: 'Contact' });
});

module.exports = router;
