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
  const genderFilter = req.query.genderFilter || "all";
  if (req.session?.lastGender && req.session.lastGender !== genderFilter) {
    req.session.lastGender = genderFilter;
    return res.redirect(`/store?page=1&genderFilter=${genderFilter}&priceFilter=${req.query.priceFilter || "Best Offer"}`);
  }
  req.session.lastGender = genderFilter;

  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;
  const priceFilter = req.query.priceFilter || "Best Offer";
  

  
  const pipeline = [];

  // Match stage for gender filtering
  if (genderFilter !== "all") {
    pipeline.push({
      $match: { gender: genderFilter }
    });
  }

  // Add sorting based on price filter
  if (priceFilter === "highLow") {
    pipeline.push({ $sort: { price: -1 } });
  } else if (priceFilter === "lowHigh") {
    pipeline.push({ $sort: { price: 1 } });
  }

  // Facet to get both total count and paginated results in one query
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      shoes: [
        { $skip: skip },
        { $limit: limit }
      ]
    }
  });

  try {
    const result = await Shoe.aggregate(pipeline);
    
    // Extract the results
    const shoes = result[0].shoes;
    const totalShoes = result[0].metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalShoes / limit);

    res.render("shoesStore", {
      shoes,
      currentPage: page,
      totalPages,
      priceFilter,
      genderFilter,
    });
  } catch (error) {
    console.error('Error in sortShoes:', error);
    res.status(500).send('Error processing request');
  }
};

exports.getShoes = async ({ priceFilter, genderFilter, skip, limit }) => {
  const pipeline = [];

  // Match stage for gender filtering
  if (genderFilter !== "all") {
    pipeline.push({
      $match: { gender: genderFilter }
    });
  }

  // Add sorting based on price filter
  if (priceFilter === "highLow") {
    pipeline.push({ $sort: { price: -1 } });
  } else if (priceFilter === "lowHigh") {
    pipeline.push({ $sort: { price: 1 } });
  }

  // Add pagination
  pipeline.push(
    { $skip: skip },
    { $limit: limit }
  );

  return await Shoe.aggregate(pipeline);
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
