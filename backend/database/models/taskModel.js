import mongoose, { mongo } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true, minlength: 4 },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },

    description: { type: String, required: true, default: "no description" },
    dueDate: {
      type: Date,
      required: true,
      default: Date.now, // Default to current date if not provided
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    complete: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
