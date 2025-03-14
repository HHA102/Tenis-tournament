const Tournament = require("../models/Tournament");

// 📌 Lấy danh sách tất cả giải đấu
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Failed to fetch tournaments", details: error.message });
  }
};

// 📌 Thêm giải đấu mới (Chỉ Organizer)
exports.createTournament = async (req, res) => {
  try {
    const { name, stadium, location, startDate, endDate } = req.body;

    // Kiểm tra xem các trường bắt buộc có bị thiếu không
    if (!name || !stadium || !location || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields", details: "name, stadium, location, startDate, endDate are required." });
    }

    const newTournament = new Tournament({ name, stadium, location, startDate, endDate });
    await newTournament.save();

    res.status(201).json({ message: "Tournament created successfully", tournament: newTournament });
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ error: "Failed to create tournament" });
  }
};

// 📌 Cập nhật thông tin giải đấu (Chỉ Organizer)
exports.updateTournament = async (req, res) => {
  try {
    // 🔍 Kiểm tra quyền
    if (!req.user || !req.user.role.includes("organizer")) {
      return res.status(403).json({ error: "Access denied. Only organizers can perform this action." });
    }

    // 🔍 Kiểm tra tồn tại của giải đấu
    const existingTournament = await Tournament.findById(req.params.id);
    if (!existingTournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    // 📝 Cập nhật giải đấu
    const updatedTournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ message: "Tournament updated successfully", tournament: updatedTournament });
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ error: "Failed to update tournament", details: error.message });
  }
};

// 📌 Xóa giải đấu (Chỉ Organizer)
exports.deleteTournament = async (req, res) => {
  try {
    // 🔍 Kiểm tra quyền
    if (!req.user || !req.user.role.includes("organizer")) {
      return res.status(403).json({ error: "Access denied. Only organizers can perform this action." });
    }

    // 🔍 Kiểm tra tồn tại của giải đấu
    const existingTournament = await Tournament.findById(req.params.id);
    if (!existingTournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    // 🗑 Xóa giải đấu
    await Tournament.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    res.status(500).json({ error: "Failed to delete tournament", details: error.message });
  }
};
