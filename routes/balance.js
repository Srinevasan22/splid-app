const express = require('express');
const router = express.Router({ mergeParams: true });
const expenseController = require('../controllers/expensecontroller');

// ✅ Route to calculate balances for a session
router.get("/", expenseController.calculateBalance);

module.exports = router;
