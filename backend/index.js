const express = require('express');
const client = require('prom-client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const conn = require('./conn'); // Database connection
const Trip = require('./models/trip.model');

const tripCount = new client.Gauge({
    name: 'trip_total',
    help: 'Total number of trips recorded',
});
client.register.registerMetric(tripCount);

async function updateTripMetrics() {
    try {
        const count = await Trip.countDocuments({});
        tripCount.set(count);
        console.log("Trip metrics updated successfully."); // Added success message
    } catch (error) {
        console.error('Error updating trip metrics:', error.message);
    }
}

// Function to start the server and update metrics
async function startServer() {
    try {
        // Ensure database connection is established
        await conn; // If conn is a promise, this will wait for it to resolve
        console.log("Database connected successfully.");

        // Initial metric update
        await updateTripMetrics();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });

        // Set up periodic metric updates
        setInterval(updateTripMetrics, 10000); // Update every 10 seconds

    } catch (error) {
        console.error("Server startup failed:", error);
    }
}

// Middleware
app.use(express.json());
app.use(cors());

const tripRoutes = require('./routes/trip.routes');
app.use('/api/trip', tripRoutes);

app.get('/metrics', async (req, res) => {
    try {
        res.setHeader('Content-Type', client.register.contentType);
        const metrics = await client.register.metrics();
        res.send(metrics);
    } catch (error) {
        console.error("Error serving metrics:", error);
        res.status(500).send('Error collecting metrics');
    }
});

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start the server
startServer();