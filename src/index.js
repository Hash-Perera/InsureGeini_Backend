import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

//! Environment variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const URL = process.env.MONGODB_URI;

//! Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
