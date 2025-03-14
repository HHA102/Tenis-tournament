const tournamentController = require("../controllers/tournamentController");
const middlewareController = require("../controllers/middlewareController");

const router = require('express').Router();

// Lấy danh sách tất cả giải đấu
router.get("/", middlewareController.verifyToken, tournamentController.getAllTournaments);

// Thêm giải đấu mới (chỉ organizer có quyền)
router.post("/", middlewareController.verifyTokenAndOrganizerAuth, tournamentController.createTournament);

// Cập nhật thông tin giải đấu (chỉ organizer có quyền)
router.put("/:id", middlewareController.verifyTokenAndOrganizerAuth, tournamentController.updateTournament);

// Xóa giải đấu (chỉ admin hoặc organizer có quyền)
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, tournamentController.deleteTournament);

module.exports = router;
