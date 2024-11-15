const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the session
    createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
