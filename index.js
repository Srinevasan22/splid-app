const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
const participantsRoute = require('./routes/participants');
app.use('/participants', participantsRoute);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Splid API');
});

// Start the server - Test6
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
