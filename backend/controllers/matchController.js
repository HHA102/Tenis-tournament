const { ROLE, MATCH_STATUS } = require("../constants");
const Court = require("../models/Court");
const Match = require("../models/Match");
const User = require("../models/User");
const Tournament = require("../models/Tournament");
const { transformUserForResponse } = require("../services/userService");
const { default: queryString } = require("query-string");

const matchController = {
  populateMatchInfo: async (match) => {
    const matchObj = match.toObject();
    const player1Id = match.player1;
    const player2Id = match.player2;
    const player1 = await User.findById(player1Id);
    const player2 = await User.findById(player2Id);
    matchObj.player1 = transformUserForResponse(player1);
    matchObj.player2 = transformUserForResponse(player2);
    const courtId = match.court;
    const court = await Court.findById(courtId);
    matchObj.court = court;
    const refereeId = match.referee;
    if (refereeId) {
      const referee = await User.findById(refereeId);
      matchObj.referee = transformUserForResponse(referee);
    }
    matchObj.tournament = await Tournament.findById(match.tournament);
    return matchObj;
  },
  createMatch: async (req, res) => {
    const {
      player1,
      player2,
      scheduledTime,
      location,
      tournamentId,
      court,
      round,
      referee,
    } = req.body;

    try {
      if (scheduledTime) {
        const now = new Date();
        const scheduledTimeToDate = new Date(scheduledTime);
        if (scheduledTimeToDate < now) {
          return res
            .status(400)
            .json({ message: "Scheduled time must be in the future" });
        }
        if (
          now.getTime() + 1000 * 60 * 60 * 24 >
          scheduledTimeToDate.getTime()
        ) {
          return res.status(400).json({
            message: "Scheduled time must be at least 24 hours from now",
          });
        }
      }

      const match = new Match({
        player1,
        player2,
        scheduledTime,
        location,
        court,
        round,
        referee,
        tournament: tournamentId,
      });
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
      const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteMatch: async (req, res) => {
    try {
      await Match.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  assignReferee: async (req, res) => {
    try {
      const { matchId, refereeId } = req.body;
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      match.referee = refereeId;
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
        return res.status(404).json({ message: "Match not found" });
      }
      const matchObj = await matchController.populateMatchInfo(match);
      res.status(200).json(matchObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getOngoingMatches: async (req, res) => {
    try {
      const matches = await Match.find({ status: MATCH_STATUS.ONGOING });
      const matchesObj = await Promise.all(
        matches.map(async (match) => {
          const matchObj = await matchController.populateMatchInfo(match);
          return matchObj;
        })
      );
      res.status(200).json(matchesObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeaturedMatch: async (req, res) => {
    try {
      const match = await Match.findOne({ isFeatured: true });
      if (!match) {
        return res.status(404).json({ message: "No featured match found" });
      }
      const matchObj = await matchController.populateMatchInfo(match);
      res.status(200).json(matchObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  nominateFeaturedMatch: async (req, res) => {
    try {
      const featuredMatch = await Match.findOne({ isFeatured: true });
      if (featuredMatch) {
        featuredMatch.isFeatured = false;
        await featuredMatch.save();
      }

      const { matchId } = req.body;
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      match.isFeatured = true;
      await match.save();
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateLivestreamUrl: async (req, res) => {
    try {
      const livestreamUrl = req.body.livestreamUrl;
      const parsedUrl = queryString.parseUrl(livestreamUrl);

      const match = await Match.findByIdAndUpdate(
        req.params.id,
        {
          liveStreamId: parsedUrl?.query?.v ?? "",
        },
        {
          new: true,
        }
      );
      const matchObj = await matchController.populateMatchInfo(match);
      res.status(200).json(matchObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  startMatch: async (req, res) => {
    try {
      const matchId = req.body.matchId;
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      if (req.user.id !== match.referee.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the match's referee" });
      }
      match.status = MATCH_STATUS.ONGOING;
      match.liveScore = {
        currentSet: 1,
        currentGame: {
          player1: {
            score: 0,
          },
          player2: {
            score: 0,
          },
        },
        isLive: true,
      };
      await match.save();
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = matchController;
