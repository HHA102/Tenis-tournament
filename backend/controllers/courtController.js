const Court = require('../models/Court');

const courtController = {
    createCourt: async (req, res) => {
        const { name, location, size } = req.body;
        try {
            const court = new Court({ name, location, size });
            await court.save();
            res.status(201).json(court);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getCourts: async (req, res) => {
        try {
            const courts = await Court.find();
            res.status(200).json(courts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getCourtById: async (req, res) => {
        try {
            const court = await Court.findById(req.params.id);
            res.status(200).json(court);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateCourt: async (req, res) => {
        try {
            const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(court);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteCourt: async (req, res) => {
        try {
            await Court.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Court deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = courtController;

