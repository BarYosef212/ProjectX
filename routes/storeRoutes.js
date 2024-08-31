// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");
// Route to display shoes (store page)
router.get("/store", async (req, res) => {
  try {
    const shoes = await Shoe.find().exec(); // Fetch all shoes from the database

    res.render("shoesStore", { shoes }); // Render 'shoesStore.ejs' with shoes data
    console.log(shoes);
  } catch (error) {
    console.error("Error fetching shoes:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
