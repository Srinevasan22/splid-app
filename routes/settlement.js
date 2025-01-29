const express = require('express');
const settlementController = require('../controllers/settlementController');
const router = express.Router();

// Updated route with /splid prefix
router.post('/splid/settle', settlementController.recordSettlement);

module.exports = router;
