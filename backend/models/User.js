const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  twitterId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenSecret: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
