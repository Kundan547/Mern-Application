const express = require('express');
const routes = express.Router();
const tripDetails = require('../controllers/trip.controller');
const client = require('prom-client'); // Prometheus metrics

// Define a counter metric for API requests
const tripRequestsCounter = new client.Counter({
    name: 'trip_requests_total',
    help: 'Total number of trip API requests',
    labelNames: ['method', 'route']
});

// Middleware to track API requests
const trackRequest = (req, res, next) => {
    tripRequestsCounter.inc({ method: req.method, route: req.originalUrl });
    next();
};

routes.post('/', trackRequest, tripDetails.tripAdditionController);
routes.get('/', trackRequest, tripDetails.getTripDetailsController);
routes.get('/:id', trackRequest, tripDetails.getTripDetailsByIdController);

module.exports = routes;
