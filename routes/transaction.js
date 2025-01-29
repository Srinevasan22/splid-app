const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

// Updated route with /splid prefix
router.post('/splid/record', transactionController.recordTransaction);

module.exports = router;
