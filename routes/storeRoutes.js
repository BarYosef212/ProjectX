const express = require('express');
const router = express.Router();

// Define the route for the index page
router.get('/store', (req, res) => {
    // Render the index.ejs template located in the Pages folder
    res.render('shoesStore', { title: 'Store' });
});

module.exports = router;
