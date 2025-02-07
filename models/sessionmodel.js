const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    }, 
    email: {  // ✅ Ensure email is properly set
        type: String,
        required: true
    },
    participants: [{  
        type: String,  // ✅ Ensure participants field allows emails
    }],
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;
