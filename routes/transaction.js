const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/record', transactionController.recordTransaction);

module.exports = router;