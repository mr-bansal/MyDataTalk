import aiService from '../services/aiService.js';
import dbService from '../services/dbService.js';
import { validateSqlQuery } from '../middleware/sqlValidator.js';

export async function processQuery(req, res, next) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Missing query parameter' });
        }

        console.log('Processing natural language query:', query);

        // Translate natural language to SQL
        const { sqlQuery } = await aiService.translateToSql(query);

        // Validate SQL query
        const validation = validateSqlQuery(sqlQuery);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'SQL validation failed',
                message: validation.error,
                query: sqlQuery,
            });
        }

        // Execute the query
        const result = await dbService.executeQuery(sqlQuery);

        // Send response
        res.json({
            original_query: query,
            sql_query: sqlQuery,
            results: result.rows,
            metadata: {
                row_count: result.rowCount,
                execution_time_ms: result.executionTime,
            },
        });
    } catch (error) {
        next(error);
    }
}
