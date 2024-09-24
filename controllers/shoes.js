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


exports.getShoes = async(req,res)=>{
  try{
    const shoes = await Shoe.find();
    return shoes;
  }
  catch(error){
    return new Error("Please render the page")
  }
}
