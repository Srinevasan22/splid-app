const mongoose = require('mongoose');

if (!mongoose.connection.readyState) {
  console.error("⚠️ Mongoose is not connected yet. Delaying User model initialization.");
}

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

// Prevent duplicate model registration in case of hot reloads
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
