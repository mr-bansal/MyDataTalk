import express from 'express';
import { processQuery } from '../controllers/queryController.js';
import dbService from '../services/dbService.js';
import { getCountryTableSchema } from '../models/schema.js';

const router = express.Router();

router.post('/', processQuery);

router.get('/schema', async (req, res, next) => {
    try {
        const schema = await getCountryTableSchema();
        res.json(schema);
    } catch (error) {
        next(error);
    }
});

export default router;
