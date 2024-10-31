const session = require('express-session');
const MongoStore = require('connect-mongo');

// Session configuration middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,  // Use a secure key from your .env file
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,   // Remove maxAge to make it a session cookie
    expires: false, // Make sure it doesn't set an explicit expiration time
  },
});


// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();  // User is logged in, proceed to the next middleware
  } else {
    res.render('errorHandler');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.userId) {
    next();  // User is logged in, proceed to the next middleware
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

// Middleware to make fullName available in all views
function setUserInView(req, res, next) {
  res.locals.fullName = req.session.fullName || null;
  res.locals.admin = req.session.admin || null;
  res.locals.userId = req.session.userId || null
  next();
}

// Export the middlewares
module.exports = {
  sessionMiddleware,
  isLoggedIn,
  setUserInView,
  isAdmin,
  isLoggedOut
};


