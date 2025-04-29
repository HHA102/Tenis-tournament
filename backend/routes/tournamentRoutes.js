const tournamentController = require("../controllers/tournamentController");
const middlewareController = require("../controllers/middlewareController");
const { ROLE } = require("../constants");

const router = require("express").Router();

// Lấy danh sách tất cả giải đấu
router.get(
  "/",
  middlewareController.verifyToken,
  tournamentController.getAllTournaments
);

router.get(
  "/calendar",
  middlewareController.verifyToken,
  tournamentController.getTournamentCalendar
);

// Thêm giải đấu mới (chỉ organizer có quyền)
router.post(
  "/",
  middlewareController.verifyTokenAndOrganizerAuth,
  tournamentController.createTournament
);

// Cập nhật thông tin giải đấu (chỉ organizer có quyền)
router.put(
  "/:id",
  middlewareController.verifyTokenAndOrganizerAuth,
  tournamentController.updateTournament
);

// Xóa giải đấu (chỉ admin hoặc organizer có quyền)
router.delete(
  "/:id",
  middlewareController.verifyTokenWithCustomRoles([ROLE.ORGANIZER, ROLE.ADMIN]),
  tournamentController.deleteTournament
);

router.get(
  "/:id",
  middlewareController.verifyToken,
  tournamentController.getTournamentById
);

router.post(
  "/register",
  middlewareController.verifyToken,
  tournamentController.registerTournament
);

router.post(
  "/withdraw",
  middlewareController.verifyToken,
  tournamentController.withdrawTournament
);

router.post(
  "/approve-registration",
  middlewareController.verifyTokenAndOrganizerAuth,
  tournamentController.approveRegistration
);

router.post(
  "/decline-registration",
  middlewareController.verifyTokenAndOrganizerAuth,
  tournamentController.declineRegistration
);

router.get("/info/:id", tournamentController.getTournamentInfoById);

router.get("/info/:id/matches", tournamentController.getTournamentMatches);

router.get(
  "/approved-players/:id",
  middlewareController.verifyTokenWithCustomRoles([ROLE.ORGANIZER]),
  tournamentController.getTournamentApprovedPlayers
);

module.exports = router;
