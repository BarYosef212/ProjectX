const express = require("express");
const router = express.Router();
const branchController = require('../controllers/branch'); // Controller for branch logic
const { isLoggedIn, isAdmin } = require("../middleware/auth");


// Branch management
router.get('/AddBranch', (req, res) => {
  res.render('AddBranch');
});
router.post('/AddBranch', branchController.AddBranch);

router.get('/DeleteBranch', (req, res) => {
  res.render('DeleteBranch');
});
router.post('/DeleteBranch', branchController.deleteBranch);

router.get('/UpdateBranch', (req, res) => {
  res.render('UpdateBranch');
});
router.post('/UpdateBranch', branchController.updateBranch);

router.get('/BranchList', branchController.getBranchList);

module.exports = router;