const express = require("express");
const router = express.Router();
const shoesController = require("../controllers/shoes");
const { isAdmin } = require("../middleware/auth");

router.get('/store', shoesController.sortShoes)

router.get("/shoesAdmin",isAdmin, (req, res) => {
  res.render("shoesAdmin");
});


router.get("/getAllShoes", isAdmin,shoesController.getAllShoes);
router.post("/deleteShoe",isAdmin, shoesController.deleteShoe);
router.post("/shoesAdmin",isAdmin, shoesController.searchShoes);
router.post("/findShoes",isAdmin, shoesController.searchShoes);
router.post("/updateShoe",isAdmin,shoesController.updateShoe)
router.post("/addShoe",isAdmin,shoesController.addShoe)

module.exports = router;
