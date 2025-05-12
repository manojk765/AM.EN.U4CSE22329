const express = require('express');
const dotenv = require('dotenv');
const stockRoutes = require('./routes/stocks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', stockRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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