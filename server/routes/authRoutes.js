// server/routes/authRoutes.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// POST route for user login
router.post('/login', passport.authenticate('local'), (req, res) => {
  // If authentication is successful, return the user object
  res.json({ user: req.user });
});

// GET route for user logout
router.get('/logout', (req, res) => {
  // Logout and redirect to the home page
  req.logout();
  res.redirect('/');
});

// GET route to check if a user is authenticated
router.get('/checkAuth', (req, res) => {
  // Check if the user is authenticated
  res.json({ authenticated: req.isAuthenticated() });
});

module.exports = router;
