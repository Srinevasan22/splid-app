const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  share: {
    type: Number,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  groupId: {  // NEW FIELD
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
    required: true
  },
  createdAt: {  // NEW FIELD
    type: Date,
    default: Date.now
  }
});

const Participant = mongoose.model('participant', participantSchema);
module.exports = Participant;
