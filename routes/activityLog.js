const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');

router.get('/', async (req, res) => {
    res.status(200).json({ message: "Activity Log Endpoint" });
});

module.exports = router;