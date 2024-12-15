const mongoose = require("mongoose");

const DB = process.env.MONGODB_URI;
console.log("db uri",DB)
const connectDB = async () => {
  try {
    await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectDB;
