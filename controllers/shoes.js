const shoesService = require('../services/shoe');
const Shoe = require('../models/Shoe');


exports.renderShoePage = async(req,res,next)=>{
  try{
    const shoeName = req.params.shoeName;
    const shoe = await Shoes.findOne({name: shoeName})
    if(!shoes){
      const err = new Error('Shoe not found');
      err.status = 404;
      return next(err);
    }
    res.render('shoePage',shoe);
  }
  catch(error){
    console.log(error)
  }
}

exports.getShoes = async ({ priceFilter, genderFilter, skip, limit }) => {
  try {
    let query = {};
    // Gender filtering
    if (genderFilter && genderFilter !== "all") {
      query.gender = genderFilter;
    }

    let shoes;
    if (priceFilter === "Best Offer") {
      shoes = await Shoe.find(query).skip(skip).limit(limit); 
    } else {
      const sortOrder = priceFilter === 'highLow' ? -1 : 1;
      shoes = await Shoe.find(query).sort({ price: sortOrder }).skip(skip).limit(limit); 
    }
    return shoes; 
  } catch (error) {
    console.log("Error in getShoes:", error);
    throw new Error("Error fetching shoes");
  }
};
