const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Correct route path without /splid prefix
router.post('/login', userController.loginUser);

module.exports = router;
