const courtController = require("../controllers/courtController");
const middlewareController = require("../controllers/middlewareController");

const router = require('express').Router();

router.get("/", middlewareController.verifyToken, courtController.getCourts);

router.get("/:id", middlewareController.verifyToken, courtController.getCourtById);

router.post("/", middlewareController.verifyTokenAndOrganizerAuth, courtController.createCourt);

router.put("/:id", middlewareController.verifyTokenAndOrganizerAuth, courtController.updateCourt);

router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, courtController.deleteCourt);

module.exports = router;
