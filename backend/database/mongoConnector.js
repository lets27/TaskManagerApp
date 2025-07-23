import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MongoUri;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
    });

    console.log("MongoDB Connected:", {
      host: conn.connection.host,
    });

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
