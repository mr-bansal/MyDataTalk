const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const queryRoutes = require('./routes/queryRoutes');
const exportRoutes = require('./routes/exportRoutes');

// Import middleware and services
const errorHandler = require('./middleware/errorHandler');
const dbService = require('./services/dbService'); // Add this import

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Initialize database tables
async function initDatabase() {
    try {
        await dbService.ensureHistoryTableExists();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Failed to initialize database tables:', error);
    }
}

// Routes
app.use('/api/query', queryRoutes);
app.use('/api/export', exportRoutes);

// Handle client-side routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Initialize database tables on startup
    await initDatabase();
});

module.exports = app;