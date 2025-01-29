const express = require('express');
const settlementController = require('../controllers/settlementController');
const router = express.Router();

router.post('/settle', settlementController.recordSettlement);

module.exports = router;
