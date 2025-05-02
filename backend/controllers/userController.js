const Tournament = require("../models/Tournament");
const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const sharp = require("sharp");
const { transformUserForResponse } = require("../services/userService");

const userController = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      if (!user) {
        return res.status(404).json({ message: "No users found" });
      }
      const transformedUser = await Promise.all(
        user.map((u) => {
          return transformUserForResponse(u);
        })
      );
      res.status(200).json(transformedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      User.findByIdAndDelete(req.params.id, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted : ", docs);
        }
      });
      res.status(200).json("Delete successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updatePersonalInfo: async (req, res) => {
    try {
      const userId = req.user.id;
      const { email, phoneNumber, fullName, dateOfBirth, address } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.email = email;
      user.personalInfo = { phoneNumber, fullName, dateOfBirth, address };
      await user.save();
      res.status(200).json({ message: "Personal info updated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateProfileByAdmin: async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        email,
        phoneNumber,
        fullName,
        dateOfBirth,
        address,
        username,
        role,
      } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.email = email;
      user.personalInfo = { phoneNumber, fullName, dateOfBirth, address };
      user.username = username;
      user.role[0] = role;
      await user.save();
      res.status(200).json({ message: "Personal info updated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deactivateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.isActive = false;
      await user.save();
      res.status(200).json({ message: "User deactivated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  activateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.isActive = true;
      await user.save();
      res.status(200).json({ message: "User activated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.email = email;
      await user.save();
      res.status(200).json({ message: "Email updated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updatePhone: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.personalInfo.phoneNumber = phoneNumber;
      await user.save();
      res.status(200).json({ message: "Phone updated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateFCMToken: async (req, res) => {
    try {
      const { fcmToken } = req.body;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.fcmTokens.includes(fcmToken)) {
        return res.status(200).json({ message: "FCM token already exists" });
      }

      user.fcmTokens.push(fcmToken);
      await user.save();
      res.status(200).json({ message: "FCM token updated successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const transformedUser = transformUserForResponse(user);
      res.status(200).json(transformedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUserByToken: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const registeredTournaments = await Tournament.find({
        "participants.player": mongoose.Types.ObjectId(req.user.id),
      });

      const registeredTournamentsData = registeredTournaments.map(
        (tournament) => ({
          _id: tournament._id,
          name: tournament.name,
          status: tournament.status,
          myRegistrationStatus: tournament.participants.find(
            (p) => p.player.toString() === req.user.id
          ).status,
        })
      );

      res.status(200).json({
        userInfo: user.personalInfo,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        registeredTournaments: registeredTournamentsData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateProfilePicture: async (req, res) => {
    try {
      const userId = req.params.id || req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { base64Image } = req.body;
      if (!base64Image) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Remove the data URL prefix if present
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
      let finalImageBuffer = imageBuffer;

      // Check if image size is larger than 1MB
      if (imageBuffer.length > MAX_FILE_SIZE) {
        // Compress the image
        finalImageBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 60 })
          .toBuffer();
      }

      // Create form data for ImgBB upload
      const formData = new FormData();
      formData.append("image", finalImageBuffer, {
        filename: `${userId}-profile.jpg`,
        contentType: "image/jpeg",
      });
      formData.append("key", process.env.IMGBB_API_KEY);

      // Upload to ImgBB
      const response = await fetch(process.env.IMGBB_API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to ImgBB" });
      }

      // Update user's profile picture with ImgBB URL
      user.profilePicture = data.data.url;
      await user.save();

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: data.data.url,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json(err);
    }
  },
  updateProfilePictureByAdmin: async (req, res) => {
    try {
      // Get the target user ID from params
      const targetUserId = req.params.id;
      if (!targetUserId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Create a modified request object with the target user ID
      const modifiedReq = {
        ...req,
        params: { ...req.params, id: targetUserId },
      };

      // Call the base function with modified request
      await userController.updateProfilePicture(modifiedReq, res);
    } catch (error) {
      console.error("Admin profile picture update error:", error);
      res.status(500).json({
        message: "Failed to update profile picture",
        error: error.message,
      });
    }
  },
  getAllUserByRole: async (req, res) => {
    try {
      const role = req.params.role;

      const users = await User.find({ role: role });
      if (!users) {
        return res.status(404).json({ message: "No users found" });
      }
      const transformedUser = await Promise.all(
        users.map((u) => {
          const obj = u.toObject();
          delete obj.password;
          delete obj.fcmTokens;
          delete obj.refreshTokens;
          return obj;
        })
      );
      res.status(200).json(transformedUser);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
