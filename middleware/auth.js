const session = require('express-session');
const MongoStore = require('connect-mongo');

// Session configuration middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,  // Use a secure key from your .env file
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION_STRING,  // MongoDB connection string
  }),
  cookie: {
    maxAge: 1000 * 60 * 400,   // Session expires in 30 minutes
  },
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();  // User is logged in, proceed to the next middleware
  } else {
    res.redirect('/login');  // If not logged in, redirect to login
  }
}

function isAdmin(req, res, next) {
  if(req.session.admin){
    console.log("admin connected!")
    next();    
  }
  else {
    console.log("not admin")
    return false;
  }
}

// Middleware to make fullName available in all views
function setUserInView(req, res, next) {
  res.locals.fullName = req.session.fullName || null;
  res.locals.admin = req.session.admin || null;
  next();
}

// Export the middlewares
module.exports = {
  sessionMiddleware,
  isLoggedIn,
  setUserInView,
  isAdmin,
};
