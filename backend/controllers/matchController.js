const { ROLE } = require('../constants');
const Court = require('../models/Court');
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');

const matchController = {
    createMatch: async (req, res) => {
        const { player1, player2, scheduledTime, location, tournamentId, court, round, referee } = req.body;
        console.log('req.body', req.body);

        try {
            if (scheduledTime) {
                const now = new Date();
                const scheduledTimeToDate = new Date(scheduledTime);
                if (scheduledTimeToDate < now) {
                    return res.status(400).json({ message: 'Scheduled time must be in the future' });
                }
                if (now.getTime() + 1000 * 60 * 60 * 24 > scheduledTimeToDate.getTime()) {
                    return res.status(400).json({ message: 'Scheduled time must be at least 24 hours from now' });
                }
            }

            const match = new Match({ player1, player2, scheduledTime, location, court, round, referee, tournament: tournamentId });
            await match.save();
            const tournament = await Tournament.findById(tournamentId);

            tournament.matches.push(match._id);
            await tournament.save();

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
    },
    assignReferee: async (req, res) => {
        try {
            const { matchId, refereeId } = req.body;
            const match = await Match.findById(matchId);
            if (!match) {
                return res.status(404).json({ message: 'Match not found' });
            }
            match.referee = refereeId;
            console.log('match', match);

            await match.save();
            res.status(200).json(match);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getMatchInfoById: async (req, res) => {
        try {
            const match = await Match.findById(req.params.id);
            if (!match) {
                return res.status(404).json({ message: 'Match not found' });
            }
            const player1Id = match.player1;
            const player2Id = match.player2;
            const player1 = await User.findById(player1Id);
            const player2 = await User.findById(player2Id);
            match.player1 = player1;
            match.player2 = player2;
            const courtId = match.court;
            const court = await Court.findById(courtId);
            match.court = court;
            const refereeId = match.referee;
            const referee = await User.findById(refereeId);
            match.referee = referee;
            res.status(200).json(match);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = matchController;
