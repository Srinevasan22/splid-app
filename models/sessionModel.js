const mongoose = require('mongoose');

// Define the schema for a session
const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true // Name of the session, required field
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now // Automatically sets timestamp when a session is created
    }
});

// Create a model for the session schema
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
