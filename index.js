const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const app = express();
const PORT = 3000; // Explicitly set the port to 3000

// Access the GitHub secret and MongoDB URI from environment variables
const mySecret = process.env['github_secret'];
const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/splidDB';

// MongoDB connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware to parse JSON
app.use(express.json());

// Routes
const participantsRoute = require('./routes/participants');
app.use('/participants', participantsRoute);

const expensesRoute = require('./routes/expenses'); // Import expenses routes
app.use('/expenses', expensesRoute); // Register expenses routes

// Health check route to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is up and running' });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Splid API');
});

// Test route to check if the secret is being retrieved correctly
app.get('/test-secret', (req, res) => {
  if (mySecret) {
    res.send(`GitHub Secret: ${mySecret}`);
  } else {
    res.send('No GitHub secret found');
  }
});

// Start the server - now on port 3000 - Session2
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
