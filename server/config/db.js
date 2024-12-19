import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  // Check if the MONGO_URI environment variable is set
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined. Please check your .env file.");
    process.exit(1); // Exit the process if MONGO_URI is not set
  }

  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
