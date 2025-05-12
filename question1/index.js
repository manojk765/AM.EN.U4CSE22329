const express = require('express');
const dotenv = require('dotenv');
const stockRoutes = require('./routes/stocks');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/', stockRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying another port...`);
    setTimeout(() => {
      server.close();
      app.listen(0, () => {
        console.log(`Server is running on port ${server.address().port}`);
      });
    }, 1000);
  } else {
    console.error('Server error:', error);
  }
});

module.exports = app; 