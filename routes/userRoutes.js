const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { isLoggedIn } = require('../middleware/auth');

router.get('/',userController.renderHomePage)
router.get('/home',isLoggedIn,userController.renderHomePage)

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

router.get('/logout',(req,res)=>{
  res.render('index')
})

router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
      return res.redirect('/');  // Redirect to home even if there's an error
    }

    // Successfully logged out, redirect to login page
    res.redirect('/login');
  });
});

module.exports = router