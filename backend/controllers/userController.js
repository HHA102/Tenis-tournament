const User = require("../models/User");

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
};

module.exports = userController;
