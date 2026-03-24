import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tokenHash: String,
    sessionId: String,
    issuedAt: Date,
    expiresAt: Date,
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);