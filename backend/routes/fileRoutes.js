const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/upload', fileController.uploadFile);
router.delete('/delete', fileController.deleteFile);
router.get('/stream', fileController.getFileStream);

module.exports = router;
