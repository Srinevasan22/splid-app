const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

// Correct route path without /splid prefix
router.post('/record', transactionController.recordTransaction);

module.exports = router;
