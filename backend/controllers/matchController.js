const Match = require('../models/Match');

const matchController = {
    createMatch: async (req, res) => {
        const { team1, team2, date, time, location } = req.body;
        try {
            const match = new Match({ team1, team2, date, time, location });
            await match.save();
            res.status(201).json(match);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getMatches: async (req, res) => {
        try {
            const matches = await Match.find();
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getMatchById: async (req, res) => {
        try {
            const match = await Match.findById(req.params.id);
            res.status(200).json(match);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateMatch: async (req, res) => {
        try {
            const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(match);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteMatch: async (req, res) => {
        try {
            await Match.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Match deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = matchController;
