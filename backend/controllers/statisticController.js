const Statistic = require('../models/Statistic');

const statisticController = {
    createStatistic: async (req, res) => {
        const { title, value, userId } = req.body;
        try {
            const statistic = new Statistic({ title, value, userId });
            await statistic.save();
            res.status(201).json(statistic);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getStatistics: async (req, res) => {
        try {
            const statistics = await Statistic.find();
            res.status(200).json(statistics);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getStatisticById: async (req, res) => {
        try {
            const statistic = await Statistic.findById(req.params.id);
            res.status(200).json(statistic);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateStatistic: async (req, res) => {
        try {
            const statistic = await Statistic.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(statistic);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteStatistic: async (req, res) => {
        try {
            await Statistic.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Statistic deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = statisticController;

