const Tournament = require("../models/Tournament");
const User = require("../models/User");
const mongoose = require("mongoose");

const userController = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      if (!user) {
        return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json(user);
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
      const { email, phone, fullName, dateOfBirth, address } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.personalInfo = { email, phone, fullName, dateOfBirth, address };
      await user.save();
      res.status(200).json({ message: "Personal info updated successfully" });
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
      const { phone } = req.body;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.phone = phone;
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
      res.status(200).json(user);
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
        'participants.player': mongoose.Types.ObjectId(req.user.id)
      });

      const registeredTournamentsData = registeredTournaments.map(tournament => ({
        _id: tournament._id,
        name: tournament.name,
        status: tournament.status,
        myRegistrationStatus: tournament.participants.find(p => p.player.toString() === req.user.id).status
      }));

      res.status(200).json({
        userInfo: user.personalInfo,
        registeredTournaments: registeredTournamentsData
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = userController;
