const mongoose = require("mongoose");
const { ROLE } = require("../constants/index");

const userSchema = new mongoose.Schema(
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
    role: {
      type: [String],
      enum: [
        ROLE.USER,
        ROLE.PLAYER,
        ROLE.SPONSOR,
        ROLE.ORGANIZER,
        ROLE.REFEREE,
        ROLE.ADMIN,
      ], // Giới hạn các giá trị có thể
      default: ROLE.USER,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);


