const Tournament = require('../models/Tournament');

exports.createTournament = async (req, res) => {
  try {
    const { name, startDate, endDate, status } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Thông tin thiếu hoặc không hợp lệ.' });
    }
    const tournament = await Tournament.create({ name, startDate, endDate, status });
    res.status(201).json({ message: 'Tạo giải đấu thành công.', tournament });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra.', error: error.message });
  }
};

exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra.', error: error.message });
  }
};
