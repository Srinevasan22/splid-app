const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Access the GitHub secret from the environment variables
const mySecret = process.env['github_secret']; // Retrieves the secret from Replit's secrets environment

// Middleware to parse JSON
app.use(express.json());

// Routes
const participantsRoute = require('./routes/participants');
app.use('/participants', participantsRoute);

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

// Start the server - test 1
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
