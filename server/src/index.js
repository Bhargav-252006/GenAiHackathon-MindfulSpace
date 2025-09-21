const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import routes
const chatRoutes = require('./routes/chat');
const moodRoutes = require('./routes/mood');
const resourcesRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration (dynamic for Render)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser requests or same-origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MindfulSpace API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API routes
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/chat`, chatRoutes);
app.use(`${apiPrefix}/mood`, moodRoutes);
app.use(`${apiPrefix}/resources`, resourcesRoutes);

// Default API response
app.get(apiPrefix, (req, res) => {
    res.json({
        message: 'MindfulSpace API v1.0.0',
        endpoints: {
            health: '/health',
            chat: `${apiPrefix}/chat`,
            mood: `${apiPrefix}/mood`,
            resources: `${apiPrefix}/resources`
        },
        documentation: 'This is a mock API for development and testing purposes only.'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist.`,
        availableEndpoints: [
            '/health',
            `${apiPrefix}/chat`,
            `${apiPrefix}/mood`,
            `${apiPrefix}/resources`
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MindfulSpace API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API endpoints: http://localhost:${PORT}${apiPrefix}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;