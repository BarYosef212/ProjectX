// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");
const shoesController = require("../controllers/shoes")

router.get('/store',async (req,res)=>{
  try{
    const page = parseInt(req.query.page) || 1; // Get current page
    const limit = 12; // Number of shoes per page
    const skip = (page - 1) * limit;
    const totalShoes = await Shoe.countDocuments(); // Get total number of shoes
    const shoes = await Shoe.find().skip(skip).limit(limit); // Fetch shoes for the current page
    const totalPages = Math.ceil(totalShoes / limit); 
    res.render('shoesStore',{shoes,currentPage:page,totalPages});
  }
  catch(error){
    console.log(error);
  }
})

module.exports = router;