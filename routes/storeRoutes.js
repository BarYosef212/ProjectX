// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");
const shoesController = require("../controllers/shoes");
const { isAdmin } = require("../middleware/auth");

router.get('/store', async (req, res) => {
  
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
  })

router.get("/shoesAdmin", (req, res) => {
  res.render("shoesAdmin");
});

router.get("/getAllShoes", shoesController.getAllShoes);
router.post("/deleteShoe",isAdmin, shoesController.deleteShoe);
router.post("/shoesAdmin",isAdmin, shoesController.searchShoes);
router.post("/findShoes",isAdmin, shoesController.searchShoes);
router.post("/updateShoe",isAdmin,shoesController.updateShoe)
router.post("/addShoe",isAdmin,shoesController.addShoe)

// router.get("/store", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get current page
//     const limit = 12; // Number of shoes per page
//     const skip = (page - 1) * limit;
//     const totalShoes = await Shoe.countDocuments(); // Get total number of shoes
//     const shoes = await Shoe.find().skip(skip).limit(limit); // Fetch shoes for the current page
//     const totalPages = Math.ceil(totalShoes / limit);
//     res.render("shoesStore", { shoes, currentPage: page, totalPages });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Server Error");
//   }
// });


//need to be handled

module.exports = router;
