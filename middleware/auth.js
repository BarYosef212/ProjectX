const session = require('express-session');


//save in session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    expires: false,
  },
});

function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.render('errorHandler',{message: "You need to login first to the website"});
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.userId) {
    next();
  } else {
    res.render('errorHandler');
  }
}

function isAdmin(req, res, next) {
  if(req.session.admin){
    next();    
  }
  else {
    res.render('errorHandler', { message: "This area is restricted to admins only!" });
  }
}

//Save in the local storage
function setUserInView(req, res, next) {
  res.locals.fullName = req.session.fullName || null;
  res.locals.admin = req.session.admin || null;
  res.locals.userId = req.session.userId || null
  next();
}

module.exports = {
  sessionMiddleware,
  isLoggedIn,
  setUserInView,
  isAdmin,
  isLoggedOut
};
