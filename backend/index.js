const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Ensure the PORT is properly defined
const PORT = process.env.PORT || 3000;

// Database connection
const conn = require('./conn'); // Ensure this connects without blocking the server

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(cors()); // Enable CORS

// Import routes
const tripRoutes = require('./routes/trip.routes');

// Mount routes
app.use('/api/trip', tripRoutes); // Routes available at http://localhost:<PORT>/trip

// Example route
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
