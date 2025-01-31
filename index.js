const express = require('express');
const mongoose = require('mongoose'); // MongoDB connection
const cors = require('cors'); // CORS middleware
const PDFDocument = require('pdfkit'); // PDF generation
const morgan = require('morgan'); // HTTP request logging
const helmet = require('helmet'); // Security headers
const winston = require('winston'); // Logging
const net = require('net'); // Used for port checking
const portfinder = require('portfinder'); // Automatically find available port
const fs = require('fs');
const { exec } = require('child_process');

const app = express();

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

// MongoDB connection with enhanced logging
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('Successfully connected to MongoDB'))
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Middleware to parse JSON
app.use(express.json());
app.use(helmet());

// Use morgan for logging HTTP requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

// Routes for Session, Participant, and Expense
const sessionRoute = require('./routes/session');
app.use('/splid/sessions', sessionRoute);  // Ensure sessions are under /splid

// Participant route under session hierarchy
const participantRoute = require("./routes/participant");
const sessionRouter = express.Router({ mergeParams: true }); // Ensure params are accessible

console.log("✅ Setting up session routes...");
sessionRouter.use("/:sessionId/participants", participantRoute);
app.use("/splid/sessions", sessionRouter); // Ensure participants route is under /splid

console.log("✅ Session routes fully loaded.");

// Expense route under session hierarchy
const expenseRoute = require('./routes/expense');
app.use('/splid/sessions/:sessionId/expenses', expenseRoute);  // Ensure expenses are under /splid

// Add other routes (Report, ActivityLog, etc.) in the same manner

const reportRoute = require('./routes/report');
app.use('/reports', reportRoute);  // /reports routes for reporting actions

const userRoute = require('./routes/user');
app.use('/users', userRoute);  // /users routes for user-related actions

const activityLogRoute = require('./routes/activityLog');
app.use('/logs', activityLogRoute);  // /logs routes for activity logs

const settlementRoute = require('./routes/settlement');
app.use('/settlements', settlementRoute);  // /settlements routes for settlement actions

const transactionRoute = require('./routes/transaction');
app.use('/transactions', transactionRoute);  // /transactions routes for transaction actions

const notificationRoute = require('./routes/notification');
app.use('/notifications', notificationRoute);  // /notifications routes for notification actions

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


app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`Registered route: ${r.route.path}`);
    }
});



// Automatically find an available port starting from 3000
portfinder.basePort = 3000;
portfinder.getPort((err, port) => {
    if (err) {
        console.error('Error finding an available port:', err);
        process.exit(1);
    }

  console.log("✅ Listing all registered routes:");
  app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
          console.log(`✅ Registered route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
      }
  });

  
    app.listen(port, '127.0.0.1', () => {
        logger.info(`Server is running on http://127.0.0.1:${port}`);

        // Store the assigned port in a file so NGINX can read it
        fs.writeFileSync('/root/splid_app/api_port.txt', port.toString());

      // Run the script to update NGINX with the new port
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
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
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
