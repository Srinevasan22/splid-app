const mongoose = require('mongoose');
const Session = require('../models/sessionmodel'); // Adjust path if needed

const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/splidDB';

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    testSessionData();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Function to test session data
async function testSessionData() {
  try {
    // Fetch all sessions
    const sessions = await Session.find();
    console.log('All sessions:', sessions);

    // Test adding a new session
    const newSession = new Session({ name: 'Test Session' });
    const savedSession = await newSession.save();
    console.log('New session added:', savedSession);

    // Test fetching the new session
    const fetchedSession = await Session.findById(savedSession._id);
    console.log('Fetched session:', fetchedSession);

    // Clean up (delete test session)
    await Session.findByIdAndDelete(savedSession._id);
    console.log('Test session deleted');

    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error during MongoDB testing:', error);
    mongoose.connection.close();
  }
}
