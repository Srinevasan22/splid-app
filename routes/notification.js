const express = require('express');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

router.post('/send', notificationController.sendNotification);

module.exports = router;