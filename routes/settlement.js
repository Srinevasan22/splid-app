const express = require('express');
const router = express.Router({ mergeParams: true });
const settlementController = require('../controllers/settlementController'); // Ensure the correct path

console.log("✅ Setting up settlement routes...");

// Register settlement routes
router.post('/', settlementController.settleUp);  // POST request works fine

// 🚨 Check if `getSessionSettlements` exists
router.get('/', settlementController.getSessionSettlements); 

console.log("✅ Settlement routes registered.");

module.exports = router;
