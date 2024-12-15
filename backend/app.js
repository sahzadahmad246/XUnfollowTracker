const dotenv = require("dotenv");
const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const path = require("path");
const axios = require('axios');
dotenv.config({ path: "backend/config/config.env" });

const app = express();
const port = 5000;

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Twitter OAuth Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    (token, tokenSecret, profile, done) => {
      const user = { token, tokenSecret, profile };
      return done(null, user);
    }
  )
);

// Routes
const authRoutes = require('./routes/authRoutes');
app.use("/api", authRoutes);



app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Fallback to index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});
// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
