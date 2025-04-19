const { ROLE } = require("../constants");
const matchController = require("../controllers/matchController");
const middlewareController = require("../controllers/middlewareController");

const router = require('express').Router();

router.post("/", middlewareController.verifyTokenAndOrganizerAuth, matchController.createMatch);

router.get("/", middlewareController.verifyToken, matchController.getMatches);

router.get("/:id", middlewareController.verifyToken, matchController.getMatchById);

router.put("/:id", middlewareController.verifyTokenAndOrganizerAuth, matchController.updateMatch);

router.delete("/:id", middlewareController.verifyTokenAndOrganizerAuth, matchController.deleteMatch);

router.post("/assign-referee", middlewareController.verifyTokenWithCustomRoles([ROLE.REFERREE_MANAGER, ROLE.ORGANIZER]), matchController.assignReferee)

module.exports = router;
