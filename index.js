const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const cors = require('cors'); // Import CORS middleware
const PDFDocument = require('pdfkit'); // Import PDF generation library
const morgan = require('morgan'); // HTTP request logger middleware
const helmet = require('helmet'); // Adds security-related HTTP headers
const winston = require('winston'); // Import Winston for logging

const app = express();
const PORT = process.env.PORT || 3003; // Dynamically set the port with an environment variable fallback to 3003

// Configure Winston logger with correct file path
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/root/splid_app/logs/app.log' }) // Updated to correct path
  ],
});

// Access the GitHub secret and MongoDB URI from environment variables
const mySecret = process.env['github_secret'];
const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/splidDB';

// MongoDB connection with enhanced logging
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Middleware to parse JSON
app.use(express.json());

// Use morgan for logging HTTP requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Use helmet to add security headers
app.use(helmet());

// Conditional CORS setup for development or if NGINX is not handling CORS
if (process.env.NODE_ENV === 'development' || process.env.CORS_ENABLED === 'true') {
  logger.info('CORS is enabled in the Node.js app');
  app.use(
    cors({
      origin: 'https://srinevasan.com', // Allow only requests from this origin
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Specify allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
      credentials: true, // Allow credentials to be sent if necessary
    })
  );
}

// Routes
const participantRoute = require('/root/splid_app/routes/participant');
app.use('/participant', participantRoute);

const expenseRoute = require('/root/splid_app/routes/expense');
app.use('/expense', expenseRoute);

const sessionRoute = require('/root/splid_app/routes/session');
app.use('/session', sessionRoute);

// Additional Routes for Reporting and Metrics
app.get('/report/sessions', async (req, res) => {
  try {
    const Session = require('./models/sessionmodel');
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Session report generated successfully', sessions });
  } catch (error) {
    logger.error('Error generating session report:', error);
    res.status(500).json({ error: 'Error generating session report', details: error.message });
  }
});

app.get('/report/participants', async (req, res) => {
  try {
    const Participant = require('./models/participantmodel');
    const participants = await Participant.find();
    res.status(200).json({ message: 'Participant report generated successfully', participants });
  } catch (error) {
    logger.error('Error generating participant report:', error);
    res.status(500).json({ error: 'Error generating participant report', details: error.message });
  }
});

// Health check route to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is up and running' });
});

// Root route to ensure proper JSON response
app.get('/', (req, res) => {
  logger.info('Root route accessed');
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
  logger.info('Shutting down gracefully...');
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server and log startup status
app
  .listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on http://0.0.0.0:${PORT}`);
  })
  .on('error', (err) => {
    logger.error('Failed to start server:', err);
    process.exit(1); // Exit if the server fails to start
  });
