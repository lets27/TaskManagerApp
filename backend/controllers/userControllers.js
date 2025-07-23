import User from "../database/models/userModel.js";
import dotenv from "dotenv";
import multer from "multer";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Task from "../database/models/taskModel.js";

dotenv.config();
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

const getUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log("req user:", req.user);
  console.log("reqHeaders:", req.headers);
  const email = req.user.email; // Assuming email is part of the user object
  console.log("user email:");

  if (!userId) {
    res.status(403);
    const error = new Error();
    error.status = 404;
    error.message = "unauthorized access";
    throw error;
  }
  if (!email) {
  }
  const userExist = await User.findOne({ email: email });
  const userReturned = {
    username: userExist.username,
    profilePicture: userExist.profilePicture,
    email: userExist.email,
  };
  if (!userExist) {
    res.status(404);
    const error = new Error();
    error.status = 404;
    error.message = "user does not exist";
    throw error;
  }

  return res.status(200).json({ user: userReturned });
});

const makeTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { taskName, description, dueDate, priority } = req.body;
  if (!taskName || !description || !dueDate || !priority) {
    const error = new Error();
    error.status = 400;
    error.message = "all fields are required";
    throw error;
  }
  //check if task already exists with that userId
  const existingTask = await Task.findOne({ taskName, user: userId });
  if (existingTask) {
    res.status(400);
    const error = new Error();
    error.status = 400;
    error.message = "Task with this name already exists";
    throw error;
  }

  const newTask = await Task.create({
    taskName: taskName,
    description: description,
    dueDate: dueDate,
    priority: priority,
    user: userId,
  });

  res.status(200).json({
    message: "Task created successfully",
    Task: newTask,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  if (!deletedTask) {
    res.status(404);
    throw new Error("Task does not exist");
  }

  // For 204 No Content, don't send any response body
  return res.status(204).end();
});

const editTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const updates = req.body;

  const { complete } = updates;
  // Check if task exists with the provided taskId and userId
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    res.status(404);
    const error = new Error();
    error.status = 404;
    error.message = "task not found please refresh page";
    throw error;
  }

  if (updates.taskName !== undefined) task.taskName = updates.taskName;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.status !== undefined) task.status = updates.status;
  // Handle 'complete' safely (if provided)
  if (complete !== undefined) {
    task.complete = Boolean(complete);
  }
  task.save();
  console.log("edited:", task);
  return res.status(200).json({
    message: "Task updated successfully",
    Task: task,
  });
});

/// mark complete

const markComplete = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  console.log("taskId:", taskId);
  // Find the task by ID and user ID
  const task = await Task.findOne({ _id: taskId });

  if (!task) {
    res.status(404);
    const error = new Error();
    error.status = 404;
    error.message = "Task not found";
    throw error;
  }
  // Update the 'complete' field
  task.complete = !task.complete; // Toggle the complete status

  //save task
  await task.save();

  const message =
    task.complete === true
      ? "task marked as complete"
      : "task marked as incomplete";
  return res.status(200).json({
    message: message,
    Task: task,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // Fetch tasks for the user
  const tasks = await Task.find({ user: userId });

  // if (!tasks || tasks.length === 0) {
  //   res.status(404);
  //   const error = new Error();
  //   error.status = 404;
  //   error.message = "No tasks found for this user";
  //   throw error;
  // }

  return res.status(200).json({
    message: "Tasks fetched successfully",
    tasks: tasks,
  });
});

// controllers/taskController.js

// Delete Completed Tasks
const deleteCompleted = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Ensure userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  // Convert userId to ObjectId if needed
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const result = await Task.deleteMany({
    user: userObjectId, // Use the ObjectId version
    complete: true,
  });

  // Debug logging
  console.log("Delete result:", result);
  console.log("Query criteria:", { user: userObjectId, complete: true });

  res.status(200).json({
    message: `Deleted ${result.deletedCount} completed tasks`,
    deletedCount: result.deletedCount,
  });
});

// Delete All Tasks
const deleteAll = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // First check if user has any tasks
  const taskCount = await Task.countDocuments({ user: userId });

  if (taskCount === 0) {
    return res.status(200).json({
      message: "No tasks found to delete",
      deletedCount: 0,
    });
  }

  const result = await Task.deleteMany({ user: userId });

  res.status(200).json({
    message: `Deleted ${result.deletedCount} tasks`,
    deletedCount: result.deletedCount,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("update body:", req.body);
  try {
    const userId = req.user.id;
    const { username } = req.body;
    const profilePicFile = req.file; // The new profile picture file

    // Validate user exists
    const userToUpdate = await User.findById(userId).session(session);
    if (!userToUpdate) {
      await session.abortTransaction();
      session.endSession();
      res.status(404);
      throw new Error("User doesn't exist");
    }

    // File validation (if new picture provided)
    if (profilePicFile) {
      if (!["image/jpeg", "image/png"].includes(profilePicFile.mimetype)) {
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw new Error("Invalid file type. Only JPEG/PNG allowed.");
      }

      // First delete old image if exists
      if (userToUpdate.filename) {
        await cloudinary.v2.uploader.destroy(userToUpdate.filename);
      }

      // Upload new image
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: foldername },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(profilePicFile.buffer);
      });

      // Update user with new image data
      userToUpdate.profilePicture = uploadResult.secure_url;
      userToUpdate.filename = uploadResult.public_id;
    }

    // Update username if provided
    if (username) {
      userToUpdate.username = username;
    }

    // Save changes
    const updatedUser = await userToUpdate.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("updateduser:", updatedUser);
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error; // Let asyncHandler forward to global error handler
  }
});

export {
  makeTask,
  deleteTask,
  editTask,
  getTasks,
  updateUser,
  deleteCompleted,
  deleteAll,
  markComplete,
  upload,
  getUser,
};
