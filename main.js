require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passportConfig = require('./passport-config'); // Include passport-config.js
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 4000;


// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a secure secret key
  resave: false, // Forces the session to be saved back to the store
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  cookie: { secure: false } // Set to true if using HTTPS
}));



app.use(passport.initialize());
app.use(passport.session());



// MongoDB connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" and "uploads" directories
app.use(express.static('public'));
app.use(express.static('uploads'));

// Flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Routes
const admin_user = require('./routes/backend/user');
const add_post = require('./routes/backend/post');
const add_tag = require('./routes/backend/tag');
const add_category = require('./routes/backend/category');
app.use('/', admin_user);
app.use('/', add_post);
app.use('/', add_tag);
app.use('/', add_category);


const admin_home = require('./routes/frontend/home');
app.use('/', admin_home);






// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



