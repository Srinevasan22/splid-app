const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    }, 
    groupId: {  // Reference to the group collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',  // Make sure this matches the model name, which is capitalized
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('Session', sessionSchema);  // Use the correct capitalized name here as well
module.exports = Session;
