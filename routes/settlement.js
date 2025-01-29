const express = require('express');
const settlementController = require('../controllers/settlementController');
const router = express.Router();

// Correct route path without /splid prefix
router.post('/settle', settlementController.recordSettlement);

module.exports = router;
