const express = require('express');
const cors = require('cors'); // CORS middleware
const helmet = require('helmet'); // Security headers
const morgan = require('morgan'); // HTTP request logging
const PDFDocument = require('pdfkit'); // PDF generation
const winston = require('winston'); // Logging
const net = require('net'); // Used for port checking
const portfinder = require('portfinder'); // Automatically find available port
const fs = require('fs');
const { exec } = require('child_process');
const authRoute = require('./routes/auth');
const { MongoClient } = require('mongodb'); // Native MongoDB driver

require('./models/usermodel');  // ✅ Ensures User model is registered
require('dotenv').config();

const app = express();

// ✅ Ensure JSON Parsing Middleware is Enabled
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/root/splid_app/logs/app.log' }) // Correct path for logs
  ],
});

// Access the GitHub secret and MongoDB URI from environment variables
const mySecret = process.env['github_secret'];
const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/splidDB';
let db;

// MongoDB Connection using Native Driver
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    logger.info('Successfully connected to MongoDB');
    db = client.db('splidDB');
  })
  .catch(err => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Middleware to parse JSON
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Use morgan for logging HTTP requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Conditional CORS setup
if (process.env.NODE_ENV === 'development' || process.env.CORS_ENABLED === 'true') {
  logger.info('CORS is enabled in the Node.js app');
  app.use(
    cors({
      origin: 'https://srinevasan.com',
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
}

// Routes
const sessionRoute = require('./routes/session');
app.use('/sessions', sessionRoute);

const participantRoute = require('./routes/participant');
const expenseRoute = require('./routes/expense');
const settlementRoute = require('./routes/settlement');

app.use('/sessions/:sessionId/participants', participantRoute);
app.use('/sessions/:sessionId/expenses', expenseRoute);
app.use('/sessions/:sessionId/settlements', settlementRoute);

const reportRoute = require('./routes/report');
app.use('/reports', reportRoute);

const userRoute = require('./routes/user');
app.use('/users', userRoute);

const activityLogRoute = require('./routes/activityLog');
app.use('/logs', activityLogRoute);

const transactionRoute = require('./routes/transaction');
app.use('/transactions', transactionRoute);

const notificationRoute = require('./routes/notification');
app.use('/notifications', notificationRoute);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is up and running' });
});

// Root route
app.get('/', (req, res) => {
  logger.info('Root route accessed');
  res.json({ message: 'Welcome to the Splid API' });
});

// Route to generate and return a sample PDF
app.get('/generate-sample-pdf', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text('Hello! This is a test PDF generated by PDFKit.');
  doc.end();
});

// Automatically find an available port starting from 3000
portfinder.basePort = 3000;
portfinder.getPort((err, port) => {
  if (err) {
    console.error('Error finding an available port:', err);
    process.exit(1);
  }

  app.listen(port, '127.0.0.1', () => {
    logger.info(`Server is running on http://127.0.0.1:${port}`);
    fs.writeFileSync('/root/splid_app/api_port.txt', port.toString());
    exec('/root/update_nginx.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error updating NGINX: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`NGINX update stderr: ${stderr}`);
        return;
      }
      console.log(`NGINX updated successfully: ${stdout}`);
    });
  });
});


// Graceful Shutdown Hook
process.on('SIGINT', async () => {
   logger.info('Shutting down gracefully...');
   try {
       logger.info('Closing MongoDB connection...');
       process.exit(0);
   } catch (error) {
       logger.error('Error during shutdown:', error);
       process.exit(1);
   }
});

console.log("✅ Final listing of ALL registered routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ Global Route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
    }
});
console.log("✅ End of route listing.");