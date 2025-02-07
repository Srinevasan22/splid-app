const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensure sessionId is passed correctly
const settlementController = require('../controllers/settlementController'); // Ensure correct path

console.log("✅ Setting up settlement routes...");

// Register the `/settle-up` route under `/sessions/:sessionId/settle-up`
router.post('/', settlementController.settleUp);  // Remove extra `/settle-up`

// ✅ Route to get all settlements for a session
router.get('/', settlementController.getSessionSettlements);

console.log("✅ Settlement routes registered.");

module.exports = router;
