const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
// Twitter login route
router.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter callback route
router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/followers'); // Redirect to followers page after successful login
  }
);

// Fetch followers route
router.get('/followers', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  // Get the user's followers from the database
  const user = req.user;

  // Return the followers from the database
  res.json(user.followers);
});

  axios
    .get('https://api.twitter.com/1.1/followers/list.json', {
      params: { count: 10 },
      headers,
    })
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;
