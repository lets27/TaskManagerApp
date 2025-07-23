import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { decode } from "jsonwebtoken";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import cloudinary from "cloudinary";
import User from "../database/models/userModel.js";
import dotenv from "dotenv";
import multer from "multer";
import asyncHandler from "express-async-handler";

dotenv.config();
const secretKey = process.env.JWTSECRET;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const APIKEY = process.env.APIKEY;
const foldername = process.env.foldername;
const cloudname = process.env.cloudname;
const APISECRET = process.env.APISECRET;

cloudinary.config({
  cloud_name: cloudname,
  api_key: APIKEY,
  api_secret: APISECRET,
});

const signup = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log("body:", req.body);
  const { username, email, password } = req.body;
  console.log("file:", req.file);
  if (!username || !email || !password || !req.file) {
    await session.abortTransaction();
    session.endSession();
    res.status(400); //set status before throwing error
    throw new Error("Please provide email, username, password, and image.");
  }

  const existingUser = await User.findOne({ email }).session(session);
  if (existingUser) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    const error = new Error();
    error.status = 400;
    error.message = "User already exists with this email";
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // File validation
  if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    const error = new Error();
    error.status = 400;
    error.message = "Invalid file type. Only JPEG/PNG allowed";
    throw error;
  }

  // Cloudinary upload
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: foldername },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(req.file.buffer);
  });

  const newUser = await User.create(
    [
      {
        email,
        username,
        password: hashedPassword,
        profilePicture: uploadResult.secure_url,
        filename: uploadResult.public_id,
        isVerified: false,
      },
    ],
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "User created successfully",
    user: newUser[0], // Since we used array syntax
  });
});

const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    res.status(400); //set status before throwing error
    const error = new Error();
    error.status = 400;
    error.message = "wrong or empty credentials";
    throw error;
  }

  console.log(req.body);
  const userObject = await User.findOne(
    { email: email } // Query criteria (must be an object)
  );
  // console.log("user:", userObject);

  if (!userObject) {
    res.status(404);
    throw new Error("user not found");
  }

  const formData = {
    email: email,
    password: password,
  };

  //check passwords match
  const isPasswordMatch = await bcrypt.compare(
    formData.password,
    userObject.password
  );

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const tokenPayload = {
    id: userObject._id,
    email: userObject.email,
    username: userObject.username,
    profilePicture: userObject.profilePicture,
    filename: userObject.filename,
  };

  const userReturned = {
    username: userObject.username,
    profilePicture: userObject.profilePicture,
    email: userObject.email,
  };
  sign(tokenPayload, secretKey, (err, token) => {
    if (err) return res.status(500).json("failed to generate token");

    // If you want to see how it appears in headers (for debugging)
    const decoded = decode(token); // decode manually
    console.log("Decoded right after signing:", decoded);
    console.log(token);
    return res.status(200).json({ user: userReturned, token: token });
  });
});

export { signup, login, upload };
