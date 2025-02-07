const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    }, 
    email: {  // Track who created the session using email
        type: String,
        required: true
    },
    participants: [{  // List of users in the session
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;