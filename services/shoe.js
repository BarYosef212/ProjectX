const Shoe = require("../models/Shoe");

exports.addShoe = async(name,title,url,price,shoeGender)=>{
  const shoe = new Shoe({
    name:name,
    title:title,
    primaryImage:url,
    price:price,
    gender:shoeGender,
  })
  if(shoe){
    await shoe.save();
    console.log("shoe added")
    return shoe;
  }
  else{
    return null
  }
}

exports.updateShoe = async (updatedData, shoeId) => {
  const updatedShoe = await Shoe.findByIdAndUpdate(shoeId, updatedData, {
    new: true,
  });
  if (updatedShoe) return updatedShoe;
  else return null;
};

exports.getAllShoes = async (req, res) => {
  const shoes = await Shoe.find({}).sort({ _id: -1 });
  if (shoes) {
    return shoes;
  } else {
    return null;
  }
};

exports.deleteShoe = async (shoeId) => {
  const result = await Shoe.findOneAndDelete({ _id: shoeId });
  if (result) {
    return result;
  } else {
    return null;
  }
};

exports.searchShoes = async (search) => {
  const shoes = await Shoe.find({
    name: { $regex: search, $options: "i" },
    //
  }).sort({ _id: -1 });
  if (shoes) {
    return shoes;
  } else {
    return null;
  }
};
