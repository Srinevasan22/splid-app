const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    }, 
    groupId: {  // Ensure this field is defined properly
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',  // Ensure that 'group' is the correct reference to the group model
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;
