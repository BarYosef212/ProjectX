const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

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

module.exports = router