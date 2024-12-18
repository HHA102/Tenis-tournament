const express = require('express');
const { createTournament, getTournaments } = require('../controllers/tournamentController');
const router = express.Router();

router.post('/create', createTournament);
router.get('/', getTournaments);

module.exports = router;
