const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    email: {  
        type: String,
        required: true
    },
    participants: [{  
        type: String,  
    }],
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('Session', sessionSchema); // <-- Ensure model name is properly capitalized
module.exports = Session;
