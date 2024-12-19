const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const express = require("express");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const connectDB = require("./config/db");

const User = require("./models/User");

const app = express();
const port = 5000;
connectDB();

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, maxAge: 60000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log('OAuth token:', token);
        console.log('OAuth tokenSecret:', tokenSecret);
        console.log('User profile:', profile);

        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          user = await User.create({
            twitterId: profile.id,
            name: profile.displayName,
            username: profile.username,
            profileImage: profile.photos[0].value,
            token,
            tokenSecret,
          });
        }

        // Fetch followers after user is created or found
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const followersResponse = await axios.get('https://api.twitter.com/1.1/followers/list.json', {
          params: { count: 10 },
          headers,
        });

        user.followers = followersResponse.data.users;
        await user.save();

        console.log('User after saving:', user);
        return done(null, user);
      } catch (error) {
        console.error('Error in TwitterStrategy:', error);
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
