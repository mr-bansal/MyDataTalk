const aiService = require('../services/aiService');
const dbService = require('../services/dbService');
const sqlValidator = require('../middleware/sqlValidator');


async function processQuery(req, res, next) {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                error: 'Missing query parameter'
            });
        }

        console.log('Processing natural language query:', query);

        // Translate natural language to SQL
        const { sqlQuery, confidence } = await aiService.translateToSql(query);

        // Handle low confidence or empty SQL
        if (!sqlQuery || confidence < 70) {
            const clarification = await aiService.generateClarificationRequest(query, sqlQuery);

            return res.status(202).json({
                status: 'needs_clarification',
                original_query: query,
                attempted_sql: sqlQuery || '',
                confidence,
                clarification_questions: clarification,
                message: 'Low confidence in SQL translation. Please clarify your question.'
            });
        }

        // Validate SQL query
        const validation = sqlValidator.validateSqlQuery(sqlQuery);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'SQL validation failed',
                message: validation.error,
                query: sqlQuery
            });
        }

        // Execute the query
        const result = await dbService.executeQuery(sqlQuery);

        // Save query to history
        const historyEntry = await dbService.saveQueryHistory(
            query,
            sqlQuery,
            result.rowCount,
            result.executionTime
        );



        // Send response
        res.json({
            original_query: query,
            sql_query: sqlQuery,
            results: result.rows,
            metadata: {
                row_count: result.rowCount,
                execution_time_ms: result.executionTime,
                query_id: historyEntry?.id,
            }
        });
    } catch (error) {
        next(error);
    }
}


async function handleClarification(req, res, next) {
    try {
        const { original_query, clarification } = req.body;

        if (!original_query || !clarification) {
            return res.status(400).json({
                error: 'Missing required parameters'
            });
        }

        // Generate new SQL with clarification
        const enhancedQuery = `${original_query} ${clarification}`;
        const { sqlQuery, confidence } = await aiService.translateToSql(enhancedQuery);

        // If still low confidence, ask for more clarification
        if (!sqlQuery || confidence < 70) {
            const clarificationRequest = await aiService.generateClarificationRequest(
                enhancedQuery,
                sqlQuery
            );

            return res.status(202).json({
                status: 'needs_clarification',
                original_query: original_query,
                attempted_sql: sqlQuery || '',
                confidence,
                clarification_questions: clarificationRequest,
                message: 'Low confidence in SQL translation. Please clarify your question.'
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    processQuery,
    handleClarification
};