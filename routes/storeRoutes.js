// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");
const shoesController = require("../controllers/shoes")

router.get('/store', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get current page
    const limit = 12; // Number of shoes per page
    const skip = (page - 1) * limit; // Number of shoes to skip
    const priceFilter = req.query.priceFilter || 'Best Offer'; // Get the price filter from query
    const genderFilter = req.query.genderFilter || 'all';

    // Get the total number of shoes based on the price filter
    let totalShoes ;
    if (priceFilter === "Best Offer") {
      totalShoes = await Shoe.countDocuments(); // Count all shoes if no filter is applied
    } else {
      // Count shoes based on price filter (same sorting logic as in getShoes)
      const sortOrder = priceFilter === 'highLow' ? -1 : 1;
      totalShoes = await Shoe.countDocuments().sort({ price: sortOrder });
    }

    // Fetch the filtered and paginated shoes
    let shoes = await shoesController.getShoes({ priceFilter, genderFilter,skip, limit });

    const totalPages = Math.ceil(totalShoes / limit); // Calculate total pages
    
    // Render the shoe store with the current filter and pagination
    res.render('shoesStore', { shoes, currentPage: page, totalPages, priceFilter , genderFilter});
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
