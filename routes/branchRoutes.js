const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branch"); // Controller for branch logic
const { isAdmin } = require("../middleware/auth");

// Branch management
router.get("/branchAdmin",isAdmin, (req, res) => {
  res.render("branchAdmin");
});
router.get("/getAllBranches",isAdmin,branchController.getAllBranches);
router.post("/addBranch",isAdmin, branchController.addBranch);
router.post("/deleteBranch",isAdmin, branchController.deleteBranch);
router.post("/DeleteBranch",isAdmin, branchController.deleteBranch);
router.post("/findBranches",isAdmin, branchController.findBranches);
router.post("/updateBranch",isAdmin, branchController.updateBranch);




module.exports = router;
