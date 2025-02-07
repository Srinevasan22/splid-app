const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-magic-link', authController.sendMagicLink);

module.exports = router;
