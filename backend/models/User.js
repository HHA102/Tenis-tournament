const mongoose = require("mongoose");

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
      enum: ["user", "player", "sponsor", "organizer", "referee", "admin"], // Giới hạn các giá trị có thể
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
