const mongoose = require("mongoose");
const { ROLE } = require("../constants/index");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      }
    ],
    role: {
      type: [String],
      enum: [
        ROLE.USER,
        ROLE.PLAYER,
        ROLE.SPONSOR,
        ROLE.ORGANIZER,
        ROLE.REFEREE,
        ROLE.ADMIN,
        ROLE.SPECTATOR,
        ROLE.REFEREE_MANAGER
      ], // Giới hạn các giá trị có thể
      default: ROLE.USER,
    },
    personalInfo: {
      fullName: { type: String, required: true },
      phoneNumber: String,
      dateOfBirth: Date,
      address: String
    },
    createdAt: { type: Date, default: Date.now },
    fcmTokens: [String],
    profilePicture: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);


