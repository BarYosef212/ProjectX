const userService = require('../services/user');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async(req,res,next)=>{
  try{
    const {firstName, lastName,email,password} = req.body;
    console.log(firstName, lastName, email, password)
    await userService.register(firstName, lastName,email, password);
    console.log("User registerd")
    res.redirect('/');
  }catch(error){
    next(error);
  }
}

exports.login = async (req,res,next)=>{
  try{
    const{email,password}  = req.body;
    const user = await userService.login(email,password);
    if(user){
      req.session.userId = user._id;
      req.session.email = user.email;
      res.redirect('/');
    }
    else{
      const err = new Error('Invalid email or password');
      err.status = 401;
      next(err);
    }
  }
  catch(error){
      next(error);
  }
}

exports.renderHomePage = (req,res)=>{
  res.render('index');
}