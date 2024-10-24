const shoesService = require("../services/shoe");
const Shoe = require("../models/Shoe");
const errorMessage = "An error occured, please try again later";

exports.addShoe = async (req, res) => {
  try {
    const { shoeName,shoeTitle,shoeImage,shoePrice} = req.body;
    const result = await shoesService.addShoe(shoeName,shoeTitle,shoeImage,shoePrice);
    console.log(result)
    if(result){
      res.json({
        message:"Shoe added successfully",
        shoe:result,
      })
    }
    else{
      res.status(403).json({
        message:"Couldn't add shoe",
      })
    }
  } catch (error) {
    res.status(500).json({
      message:errorMessage,
    })
  }
};

exports.updateShoe = async (req, res) => {
  try {
    const { updatedData, shoeId } = req.body;
    const result = await shoesService.updateShoe(updatedData, shoeId);

    if (result) {
      res.json({
        shoe: result,
        message: "Shoe updated successfully",
      });
    } else {
      res.status(403).json({
        message: "Problem with updating user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.getAllShoes = async (req, res) => {
  try {
    const shoes = await shoesService.getAllShoes();
    if (shoes.length>0) {
      res.json({
        shoes: shoes,
      });
    } else {
      res.status(404).json({
        message: "No shoes found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.deleteShoe = async (req, res) => {
  try {
    const { shoeId } = req.body;
    const result = await shoesService.deleteShoe(shoeId);
    if (result) {
      res.json({
        message: "Shoe deleted successfully",
        shoe: result,
      });
    } else {
      res.status(403).json({
        message: "Cannot delete shoe",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.searchShoes = async (req, res) => {
  try {
    const { search } = req.body;
    const shoes = await shoesService.searchShoes(search); 
    if (shoes) {
      res.json({
        message: `${shoes.length} Shoes found`,
        shoes: shoes,
      });
    } else {
      res.status(404).json({
        message: `No shoes found`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

// exports.renderShoePage = async (req, res, next) => {
//   try {
//     const shoeName = req.params.shoeName;
//     const shoe = await Shoe.findOne({ name: shoeName });
//     if (!shoe) {
//       const err = new Error("Shoe not found");
//       err.status = 404;
//       return next(err);
//     }
//     res.render("shoePage", shoe);
//   } catch (error) {
//     console.log(error);
//   }
// };
