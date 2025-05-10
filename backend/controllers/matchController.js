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
    if (match?.result?.winner) {
      const winner = await User.findById(match.result.winner);
      matchObj.result.winner = transformUserForResponse(winner);
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
      match.result = {
        sets: [
          {
            setNumber: 1,
            player1Games: 0,
            player2Games: 0,
          },
        ],
        winner: null,
      };
      await match.save();
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  increasePlayerScore: async (req, res) => {
    try {
      const { matchId, player } = req.body;
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      const currentGame = match.liveScore.currentGame;
      const scoringPlayer = currentGame[player];
      const opponentPlayer =
        currentGame[player === "player1" ? "player2" : "player1"];

      // Check who is the winner of the match
      const checkWinner = (setsResult) => {
        const player1Sets = setsResult.filter(
          (set) => set.setWinner === match.player1
        ).length;
        const player2Sets = setsResult.filter(
          (set) => set.setWinner === match.player2
        ).length;
        if (player1Sets > player2Sets) {
          return match.player1;
        } else if (player2Sets > player1Sets) {
          return match.player2;
        } else {
          return null;
        }
      };

      // Helper function to record set and reset game
      const recordGameAndReset = () => {
        const currentSet = match.liveScore.currentSet;
        const currentSetResult = match.result.sets.find(
          (set) => set.setNumber === currentSet
        );
        if (currentSetResult) {
          if (player === "player1") {
            currentSetResult.player1Games++;
            match.liveScore.currentGame = {
              player1: { score: 0 },
              player2: { score: 0 },
            };
            if (currentSetResult.player1Games === 6) {
              // end up this set
              currentSetResult.setWinner = match.player1;
              if (match.liveScore.currentSet === match.round) {
                match.status = MATCH_STATUS.COMPLETED;
                match.result.winner = checkWinner(match.result.sets);
              } else {
                match.result.sets.push({
                  setNumber: currentSet + 1,
                  player1Games: 0,
                  player2Games: 0,
                });
                match.liveScore.currentSet++;
              }
            }
          } else {
            currentSetResult.player2Games++;
            match.liveScore.currentGame = {
              player1: { score: 0 },
              player2: { score: 0 },
            };
            if (currentSetResult.player2Games === 6) {
              // end up this set
              currentSetResult.setWinner = match.player2;
              if (match.liveScore.currentSet === match.round) {
                match.status = MATCH_STATUS.COMPLETED;
                match.result.winner = checkWinner(match.result.sets);
              } else {
                match.result.sets.push({
                  setNumber: currentSet + 1,
                  player1Games: 0,
                  player2Games: 0,
                });
                match.liveScore.currentSet++;
              }
            }
          }
        }
      };

      // If player has advantage (score 4) and wins the point, they win the game (score 5)
      if (scoringPlayer.score === 4) {
        scoringPlayer.score = 5;
        recordGameAndReset();
      }
      // If opponent has advantage (score 4) and player wins, remove opponent's advantage
      else if (opponentPlayer.score === 4) {
        opponentPlayer.score = 3;
      }
      // If both players are at 40 (score 3), give advantage to scoring player
      else if (scoringPlayer.score === 3 && opponentPlayer.score === 3) {
        scoringPlayer.score = 4;
      }
      // If player can win the game (score 3 and opponent < 3)
      else if (scoringPlayer.score === 3 && opponentPlayer.score < 3) {
        scoringPlayer.score = 5;
        recordGameAndReset();
      }
      // Normal point scoring (0 -> 15 -> 30 -> 40)
      else if (scoringPlayer.score < 3) {
        scoringPlayer.score++;
      }

      await match.save();
      const matchObj = await matchController.populateMatchInfo(match);
      res.status(200).json(matchObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  decreasePlayerScore: async (req, res) => {
    // This is not a recommendation way to update the score, but it's a quick fix for mistakes
    try {
      const { matchId, player } = req.body;
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      const currentGame = match.liveScore.currentGame;
      const scoringPlayer = currentGame[player];
      const opponentPlayer =
        currentGame[player === "player1" ? "player2" : "player1"];

      // Helper function to reset game state
      const resetGameState = () => {
        currentGame.player1.score = 0;
        currentGame.player2.score = 0;
      };

      // Helper function to record set and reset game
      const recordSetAndReset = () => {
        match.result.sets.push({
          player1Score: currentGame.player1.score,
          player2Score: currentGame.player2.score,
        });
        match.liveScore.currentSet++;
        resetGameState();
      };

      // If player has score 5 (just won the game), revert to advantage (score 4)
      if (scoringPlayer.score === 5) {
        scoringPlayer.score = 4;
        // Remove the last set from the result since we're undoing the game win
        match.result.sets.pop();
        match.liveScore.currentSet--;
      }
      // If player has advantage (score 4), revert to deuce (score 3)
      else if (scoringPlayer.score === 4) {
        scoringPlayer.score = 3;
      }
      // If opponent has advantage (score 4), revert to deuce (score 3)
      else if (opponentPlayer.score === 4) {
        opponentPlayer.score = 3;
      }
      // If both players are at deuce (score 3), reduce scoring player's score
      else if (scoringPlayer.score === 3 && opponentPlayer.score === 3) {
        scoringPlayer.score = 2;
      }
      // If player can win the game (score 3 and opponent < 3), revert to normal scoring
      else if (scoringPlayer.score === 3 && opponentPlayer.score < 3) {
        scoringPlayer.score = 2;
      }
      // Normal point reduction (40 -> 30 -> 15 -> 0)
      else if (scoringPlayer.score > 0) {
        scoringPlayer.score--;
      }

      await match.save();
      const matchObj = await matchController.populateMatchInfo(match);
      res.status(200).json(matchObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = matchController;
