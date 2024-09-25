const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Branch = require('../models/Branch');



router.get('/',userController.renderHomePage)
router.get('/home',userController.renderHomePage)

router.get('/register',(req,res) =>{
  res.render('register');
})
router.post('/register',userController.register);


router.get('/login',(req,res)=>{
  res.render('login')
})
router.post('/login',userController.login);

router.get('/contact',(req,res)=>{
  res.render('contact');
})

router.get('/AddBranch',(req,res)=>{
  res.render('AddBranch')
})
router.post('/AddBranch',branchController.AddBranch)

router.get('/DeleteBranch', (req,res)=>{
  res.render('DeleteBranch')
})
router.post('/DeleteBranch', branchController.deleteBranch);

router.get('/UpdateBranch', (req,res)=>{
  res.render('UpdateBranch')
})
router.post('/UpdateBranch', branchController.updateBranch);

router.get('/BranchList', async (req, res) => {
  try {
    const branchName = req.query.branchName; // Get the branch name from the query parameters
        console.log("Searching for branch:", branchName);
        const branches = await Branch.find({ Store_Name: branchName });

        if (branches.length === 0) {
            res.render('branches', { error: 'No branches found.', branches: [] });
        } else {
            res.render('branches', { branches }); // Render the page with the found branches
        }
    } catch (error) {
        console.error("Error fetching branches:", error);
        res.render('branches', { error: error.message, branches: [] });
    }
});
module.exports = router