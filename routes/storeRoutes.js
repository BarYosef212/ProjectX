// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");
// Route to display shoes (store page)
router.get("/store", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const shoes = await Shoe.find().skip(skip).limit(limit);
    const totalShoes = await Shoe.countDocuments();
    const totalPages = Math.ceil(totalShoes / limit);

    res.render('shoesStore', {
        shoes,
        totalPages,
        currentPage: page
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
});

module.exports = router;
