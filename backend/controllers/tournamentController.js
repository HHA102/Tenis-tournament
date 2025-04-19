const { ROLE, REGISTRATION_STATUS } = require("../constants");
const Match = require("../models/Match");
const Notification = require("../models/Notification");
const Tournament = require("../models/Tournament");
const User = require("../models/User");
const { sendNotification } = require("../services/notificationService");
const { transformUserForResponse } = require("../services/userService");

const tournamentController = {
  getAllTournaments: async (req, res) => {
    try {
      const tournaments = await Tournament.find();
      res.status(200).json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ error: "Failed to fetch tournaments", details: error.message });
    }
  },
  createTournament: async (req, res) => {
    try {
      const { name, location, startDate, endDate, description, organizer, sponsors, registrationDeadline } = req.body;

      // Kiểm tra xem các trường bắt buộc có bị thiếu không
      if (!name || !location || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required fields", details: "name, stadium, location, startDate, endDate are required." });
      }

      const newTournament = new Tournament({ name, location, startDate, endDate, description, organizer, participants: [], sponsors, registrationDeadline, matches: [] });
      await newTournament.save();

      res.status(201).json({ message: "Tournament created successfully", tournament: newTournament });
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ error: "Failed to create tournament" });
    }
  },
  updateTournament: async (req, res) => {
    try {
      // 🔍 Kiểm tra quyền
      if (!req.user || !req.user.role.includes(ROLE.ORGANIZER)) {
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
  },
  deleteTournament: async (req, res) => {
    try {
      // 🔍 Kiểm tra quyền
      if (!req.user || !req.user.role.includes(ROLE.ORGANIZER)) {
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
  },
  registerTournament: async (req, res) => {
    try {
      const { tournamentId, userId } = req.body;
      let registerUserId;

      if (!userId) {
        registerUserId = req.user.id;
      } else {
        registerUserId = userId;
      }

      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const user = await User.findById(registerUserId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      tournament.participants.push({ player: registerUserId, registrationDate: new Date(), status: "pending" });
      await tournament.save();

      res.status(200).json({ message: "Tournament registered successfully" });
    } catch (error) {
      console.error("Error registering tournament:", error);
      res.status(500).json({ error: "Failed to register tournament", details: error.message });
    }
  },
  getTournamentById: async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.status(200).json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ error: "Failed to fetch tournament", details: error.message });
    }
  },
  approveRegistration: async (req, res) => {
    try {
      const { tournamentId, userId } = req.body;

      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const participant = tournament.participants.find(p => p.player.toString() === userId);
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      if (participant.status === REGISTRATION_STATUS.APPROVED) {
        return res.status(400).json({ error: "Participant already approved" });
      }

      participant.status = REGISTRATION_STATUS.APPROVED;
      await tournament.save();

      const notification = new Notification({
        title: "Registration Approved",
        content: `Your registration for ${tournament.name} has been approved.`,
        type: "tournament",
        recipients: [{
          user: participant.player,
          read: false,
          readAt: null
        }]
      });
      await notification.save();

      const user = await User.findById(participant.player);
      if (user.fcmTokens.length > 0) {
        const result = await sendNotification(user.fcmTokens, "Registration Approved", `Your registration for ${tournament.name} has been approved.`);
        if (!result) {
          return res.status(500).json({ message: 'Failed to send notification' });
        }
      }

      res.status(200).json({ message: "Registration approved successfully" });
    } catch (error) {
      console.error("Error approving registration:", error);
      res.status(500).json({ error: "Failed to approve registration", details: error.message });
    }
  },
  declineRegistration: async (req, res) => {
    try {
      const { tournamentId, userId } = req.body;

      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const participant = tournament.participants.find(p => p.player.toString() === userId);
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      if (participant.status === REGISTRATION_STATUS.REJECTED) {
        return res.status(400).json({ error: "Participant already rejected" });
      }

      participant.status = REGISTRATION_STATUS.REJECTED;
      await tournament.save();

      const notification = new Notification({
        title: "Registration Rejected",
        content: `Your registration for ${tournament.name} has been rejected.`,
        type: "tournament",
        recipients: [{
          user: participant.player,
          read: false,
          readAt: null
        }]
      });
      await notification.save();

      const user = await User.findById(participant.player);
      if (user.fcmTokens.length > 0) {
        const result = await sendNotification(user.fcmTokens, "Registration Rejected", `Your registration for ${tournament.name} has been rejected.`);
        if (!result) {
          return res.status(500).json({ message: 'Failed to send notification' });
        }
      }

      res.status(200).json({ message: "Registration rejected successfully" });
    } catch (error) {
      console.error("Error declining registration:", error);
      res.status(500).json({ error: "Failed to decline registration", details: error.message });
    }
  },
  getTournamentInfoById: async (req, res) => {
    try {
      let tournament = await Tournament.findById(req.params.id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      const organizerId = tournament.organizer;
      const organizer = await User.findById(organizerId);
      tournament = {
        ...tournament.toObject(),
        organizer: organizer ? transformUserForResponse(organizer) : null, // Transform organizer if it exists
      };

      const participants = tournament.participants;
      for (const participant of participants) {
        const playerId = participant.player;
        const player = await User.findById(playerId);
        participant.player = player ? transformUserForResponse(player) : null; // Transform player if it exists
      }
      delete tournament.matches;
      res.status(200).json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ error: "Failed to fetch tournament", details: error.message });
    }
  },
  getTournamentMatches: async (req, res) => {
    try {
      const tournamentId = req.params.id;
      const pageIndex = parseInt(req.query.pageIndex) || 0;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const matchIds = tournament.matches;
      const totalMatches = matchIds.length;
      const startIndex = pageIndex * pageSize;
      const paginatedMatchIds = matchIds.slice(startIndex, startIndex + pageSize);

      const matches = await Match.find({ _id: { $in: paginatedMatchIds } });
      const transformedMatches = [];

      for (const match of matches) {
        const player1 = await User.findById(match.player1);
        const player2 = await User.findById(match.player2);
        const referee = await User.findById(match.referee);

        const transformedMatch = match.toObject();
        transformedMatch.player1 = player1 ? transformUserForResponse(player1) : null;
        transformedMatch.player2 = player2 ? transformUserForResponse(player2) : null;
        transformedMatch.referee = referee ? transformUserForResponse(referee) : null;
        transformedMatches.push(transformedMatch);
      }

      res.status(200).json({
        matches: transformedMatches,
        pagination: {
          totalMatches,
          pageIndex,
          pageSize,
          totalPages: Math.ceil(totalMatches / pageSize)
        }
      });
    } catch (error) {
      console.error("Error fetching tournament matches:", error);
      res.status(500).json({ error: "Failed to fetch tournament matches", details: error.message });
    }
  }
}

module.exports = tournamentController;
