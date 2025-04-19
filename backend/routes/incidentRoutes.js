const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentControllers');
const middlewareController = require('../controllers/middlewareController');
const { ROLE } = require('../constants');

// Get all incidents
router.get('/', middlewareController.verifyToken, incidentController.getIncidents);

// Get incidents by id
router.get('/:id', middlewareController.verifyToken, incidentController.getIncidentById);

// Update incident
router.put('/:id', middlewareController.verifyTokenWithCustomRoles([ROLE.ADMIN, ROLE.ORGANIZER]), incidentController.updateIncident);

// Delete incident
router.delete('/:id', middlewareController.verifyTokenWithCustomRoles([ROLE.ADMIN, ROLE.ORGANIZER]), incidentController.deleteIncident);

// Get incidents by status
router.get('/status/:status', middlewareController.verifyToken, incidentController.getIncidentsByStatus);

// Report an incident
router.post('/report-an-incident', middlewareController.verifyTokenWithCustomRoles([ROLE.ADMIN, ROLE.ORGANIZER, ROLE.PLAYER, ROLE.REFEREE]), incidentController.createIncident);

// Resolve an incident
router.put('/resolve/:id', middlewareController.verifyTokenWithCustomRoles([ROLE.ADMIN, ROLE.ORGANIZER, ROLE.REFEREE]), incidentController.resolveIncident);

// Dismiss an incident
router.put('/dismiss/:id', middlewareController.verifyTokenWithCustomRoles([ROLE.ADMIN, ROLE.ORGANIZER, ROLE.REFEREE]), incidentController.dismissIncident);

module.exports = router;
