const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Updated route with /splid prefix
router.post('/splid/login', userController.loginUser);

module.exports = router;
