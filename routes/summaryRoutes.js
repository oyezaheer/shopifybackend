const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController'); // Assuming you have this controller

router.post('/', summaryController.summarizeProduct); // Adjust according to your needs

module.exports = router;
