const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensures sessionId is passed
const { settleUp } = require('../controllers/expensecontroller');

console.log("✅ Setting up settlement routes...");

// Settlement route under sessions
router.post('/settle-up', settleUp);

console.log("✅ Settlement route registered.");

module.exports = router;
