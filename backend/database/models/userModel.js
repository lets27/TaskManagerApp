import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 4 },
    email: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true, minlength: 4 },
    profilePicture: { type: String, default: "" },
    filename: { type: String, default: "" },
  },
  { timestamps: true } // include the created at etc
);

const User = mongoose.model("User", userSchema);
export default User;
