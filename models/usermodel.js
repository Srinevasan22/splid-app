const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userToken: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => `user_${Math.random().toString(36).substr(2, 9)}` 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation
  },
  name: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
