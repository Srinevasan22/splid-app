const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    }, 
    groupId: {  // NEW FIELD
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;
