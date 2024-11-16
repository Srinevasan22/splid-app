const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const cors = require('cors'); // Import CORS middleware
const PDFDocument = require('pdfkit'); // Import PDF generation library
const app = express();
const PORT = 3002; // Explicitly set the port to 3002

// Access the GitHub secret and MongoDB URI from environment variables
const mySecret = process.env['github_secret'];
const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/splidDB';

// MongoDB connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Middleware to parse JSON
app.use(express.json());

// Conditional CORS setup for development or if NGINX is not handling CORS
if (process.env.NODE_ENV === 'development' || process.env.CORS_ENABLED === 'true') {
  console.log('CORS is enabled in the Node.js app');
  app.use(
    cors({
      origin: 'https://srinevasan.com', // Allow only requests from this origin
      methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
      credentials: true, // Allow credentials to be sent if necessary
    })
  );
}

// Routes
const participantRoute = require('./routes/participant'); // Updated to match the singular naming
app.use('/participant', participantRoute);

const expenseRoute = require('./routes/expense'); // Updated to match the singular naming
app.use('/expense', expenseRoute);

const sessionRoute = require('./routes/session'); // Updated to match the singular naming
app.use('/session', sessionRoute);

// Additional Routes for Reporting and Metrics
app.get('/report/sessions', async (req, res) => {
  try {
    const Session = require('./models/sessionmodel'); // Dynamically load model
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Session report generated successfully', sessions });
  } catch (error) {
    console.error('Error generating session report:', error);
    res.status(500).json({ error: 'Error generating session report', details: error.message });
  }
});

app.get('/report/participants', async (req, res) => {
  try {
    const Participant = require('./models/participantmodel'); // Dynamically load model
    const participants = await Participant.find();
    res.status(200).json({ message: 'Participant report generated successfully', participants });
  } catch (error) {
    console.error('Error generating participant report:', error);
    res.status(500).json({ error: 'Error generating participant report', details: error.message });
  }
});

// Health check route to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is up and running' });
});

// Root route to ensure proper JSON response
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'Welcome to the Splid API' });
});

// Test route to check if the secret is being retrieved correctly
app.get('/test-secret', (req, res) => {
  if (mySecret) {
    res.json({ message: `GitHub Secret: ${mySecret}` });
  } else {
    res.json({ message: 'No GitHub secret found' });
  }
});

// Route to generate and return a sample PDF for testing
app.get('/generate-sample-pdf', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text('Hello! This is a test PDF generated by PDFKit.');
  doc.end();
});

// Graceful Shutdown Hook
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server and log startup status - session update
app
  .listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  })
  .on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit if the server fails to start
  });
