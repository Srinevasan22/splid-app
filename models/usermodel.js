const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userToken: { type: String, required: true, unique: true }, // Unique identifier
  email: { type: String, required: true, unique: true }, // Email-based authentication
  name: { type: String, required: true }, // User's name
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
