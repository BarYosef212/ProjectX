const shoesService = require("../services/shoe");
const Shoe = require("../models/Shoe");
const errorMessage = "An error occured, please try again later";


async function postToFacebook(id) {
  const pageAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const shoe = await Shoe.findOne({ _id: id });
  const message = `Check out our new shoe: ${shoe.name} for just $${shoe.price}!`;
  const imageUrl = shoe.primaryImage;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${pageId}/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: imageUrl,
          caption: message,
          access_token: pageAccessToken,
        }),
      }
    );

    if (response.ok) {
      console.log("Post uploaded successfully to Facebook");
    } else {
      console.log("Error while posting to Facebook:", response.statusText);
    }
  } catch (error) {
    console.log("Error with uploading post to Facebook:", error);
  }
}

exports.sortShoes = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get current page
  const limit = 12; // Number of shoes per page
  const skip = (page - 1) * limit; // Number of shoes to skip
  const priceFilter = req.query.priceFilter || "Best Offer"; // Get the price filter from query
  const genderFilter = req.query.genderFilter || "all";

  // Get the total number of shoes based on the price filter
  let totalShoes;
  if (genderFilter === "men") {
    totalShoes = await Shoe.countDocuments({ gender: "men" });
  } else if (genderFilter === "women") {
    totalShoes = await Shoe.countDocuments({ gender: "women" });
  } else {
    const sortOrder = priceFilter === "highLow" ? -1 : 1;
    totalShoes = await Shoe.countDocuments().sort({ price: sortOrder });
  }

  // Fetch the filtered and paginated shoes
  let shoes = await exports.getShoes({
    priceFilter,
    genderFilter,
    skip,
    limit,
  });

  const totalPages = Math.ceil(totalShoes / limit); // Calculate total pages

  // Render the shoe store with the current filter and pagination
  res.render("shoesStore", {
    shoes,
    currentPage: page,
    totalPages,
    priceFilter,
    genderFilter,
  });
};

exports.addShoe = async (req, res) => {
  try {
    const { shoeName, shoeTitle, shoeImage, shoePrice, shoeGender } = req.body;
    const result = await shoesService.addShoe(
      shoeName,
      shoeTitle,
      shoeImage,
      shoePrice,
      shoeGender
    );
    if (result) {
      postToFacebook(result._id.toString());
      res.json({
        message: "Shoe added successfully",
        shoe: result,
      });
    } else {
      res.status(403).json({
        message: "Couldn't add shoe",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: errorMessage,
    });
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

exports.getShoes = async ({ priceFilter, genderFilter, skip, limit }) => {
  try {
    let query = {};
    // Gender filtering
    if (genderFilter && genderFilter !== "all") {
      query.gender = genderFilter;
    }

    let shoes;
    if (priceFilter === "Best Offer") {
      shoes = await Shoe.find(query).skip(skip).limit(limit).sort({ _id: -1 });
    } else {
      const sortOrder = priceFilter === "highLow" ? -1 : 1;
      shoes = await Shoe.find(query)
        .sort({ price: sortOrder })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
    }
    return shoes;
  } catch (error) {
    console.log("Error in getShoes:", error);
    throw new Error("Error fetching shoes");
  }
};

exports.getAllShoes = async (req, res) => {
  try {
    const shoes = await shoesService.getAllShoes();
    if (shoes.length > 0) {
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
