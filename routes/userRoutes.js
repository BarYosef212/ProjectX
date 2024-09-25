const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Branch = require('../models/Branch');
const branchController = require('../controllers/branch'); // Controller for branch logic
const branchServices = require('../services/branch'); // Service layer for branch logic

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

router.get('/BranchList', branchController.getBranchList);

module.exports = router;