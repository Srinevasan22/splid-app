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

// ✅ Ensure Mongoose applies the schema correctly
mongoose.models = {};  // Clear cached models
const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
