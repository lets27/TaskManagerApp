import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  verificationToken: { type: String, unique: true, default: "" },

  passwordResetToken: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Create TTL index (optional but recommended for automatic cleanup)
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Token = mongoose.model("Token", TokenSchema);
export default Token;
