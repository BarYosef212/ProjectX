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

exports.getShoes = async ({ priceFilter, skip, limit }) => {
  try {
    let shoes;
    if (priceFilter === "Best Offer") {
      shoes = await Shoe.find().skip(skip).limit(limit); 
    } else {
      const sortOrder = priceFilter === 'highLow' ? -1 : 1;
      shoes = await Shoe.find().sort({ price: sortOrder }).skip(skip).limit(limit); 
    }
    return shoes; 
  } catch (error) {
    console.log("Error in getShoes:", error);
    throw new Error("Error fetching shoes");
  }
};


