import express from 'express';
import {
    processQuery
} from '../controllers/queryController.js';
import dbService from '../services/dbService.js';
import { getCountryTableSchema } from '../models/schema.js';

const router = express.Router();

router.post('/', processQuery);

router.post('/execute', async (req, res, next) => {
    try {
        const { sqlQuery } = req.body;
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
        const schema = await getCountryTableSchema();
        res.json(schema);
    } catch (error) {
        next(error);
    }
});

export default router;
