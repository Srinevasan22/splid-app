const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensure sessionId is passed
const settlementController = require('../controllers/settlementcontroller'); // Ensure correct path

console.log("✅ Setting up settlement routes...");

// Register the `/settle-up` route under `/sessions/:sessionId/settle-up`
router.post('/settle-up', settlementController.settleUp);

console.log("✅ Settlement routes registered.");

module.exports = router;
