const { ROLE } = require("../constants");
const matchController = require("../controllers/matchController");
const middlewareController = require("../controllers/middlewareController");

const router = require('express').Router();

router.post("/", middlewareController.verifyTokenAndOrganizerAuth, matchController.createMatch);

router.get("/", middlewareController.verifyToken, matchController.getMatches);

router.get("/info/:id", middlewareController.verifyToken, matchController.getMatchInfoById);

router.get("/featured", middlewareController.verifyToken, matchController.getFeaturedMatch);

router.get("/ongoing", middlewareController.verifyToken, matchController.getOngoingMatches);

router.get("/:id", middlewareController.verifyToken, matchController.getMatchById);

router.put("/:id", middlewareController.verifyTokenAndOrganizerAuth, matchController.updateMatch);

router.delete("/:id", middlewareController.verifyTokenAndOrganizerAuth, matchController.deleteMatch);

router.post("/assign-referee", middlewareController.verifyTokenWithCustomRoles([ROLE.REFEREE_MANAGER, ROLE.ORGANIZER]), matchController.assignReferee)

router.post("/nominate-featured", middlewareController.verifyTokenAndOrganizerAuth, matchController.nominateFeaturedMatch);

module.exports = router;
