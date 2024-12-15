const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const express = require("express");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");

const User = require("./models/User");

const app = express();
const port = 5000;
connectDB();
// Middleware
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          // If not, create a new user
          user = await User.create({
            twitterId: profile.id,
            name: profile.displayName,
            username: profile.username,
            profileImage: profile.photos[0].value,
            token,
            tokenSecret,
          });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
