const express = require('express');
const queryController = require('../controllers/queryController');
const router = express.Router();

router.post('/', queryController.processQuery);

router.post('/clarify', queryController.handleClarification);

router.get('/history', async (req, res, next) => {
    try {
        const db = require('../config/database');
        const result = await db.query(
            'SELECT * FROM query_history ORDER BY created_at DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

router.post('/execute', async (req, res, next) => {
    try {
        const { sqlQuery } = req.body;
        const dbService = require('../services/dbService');

        if (!sqlQuery) {
            return res.status(400).json({ error: 'Missing SQL query' });
        }

        const result = await dbService.executeQuery(sqlQuery);
        res.json({
            sql_query: sqlQuery,
            results: result.rows,
            metadata: {
                row_count: result.rowCount,
                execution_time_ms: result.executionTime
            }
        });
    } catch (error) {
        next(error);
    }
});

router.get('/schema', async (req, res, next) => {
    try {
        const schemaModel = require('../models/schema');
        const schema = await schemaModel.getCountryTableSchema();
        res.json(schema);
    } catch (error) {
        next(error);
    }
});

module.exports = router;