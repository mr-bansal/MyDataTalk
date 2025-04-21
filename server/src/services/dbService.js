const db = require('../config/database');
const sqlValidator = require('../middleware/sqlValidator');


async function executeQuery(sqlQuery, params = []) {
    // Validate the query first
    const validation = sqlValidator.validateSqlQuery(sqlQuery);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    try {
        // Simple parameterization for WHERE clauses with equality
        const parameterizedQuery = attemptToParameterize(sqlQuery, params);

        console.log('Executing query:', parameterizedQuery.text);
        if (parameterizedQuery.values.length > 0) {
            console.log('With parameters:', parameterizedQuery.values);
        }

        const startTime = Date.now();
        const result = await db.query(parameterizedQuery.text, parameterizedQuery.values);
        const executionTime = Date.now() - startTime;

        return {
            rows: result.rows,
            rowCount: result.rowCount,
            executionTime
        };
    } catch (error) {
        console.error('Query execution error:', error);
        throw new Error(`Database query failed: ${error.message}`);
    }
}


function attemptToParameterize(sqlQuery, existingParams) {
    let paramCount = existingParams.length;
    let text = sqlQuery;
    const values = [...existingParams];

    // Simple regex to find value literals in WHERE clauses
    const whereValueRegex = /WHERE\s+(\w+)\s*=\s*'([^']+)'/gi;

    text = text.replace(whereValueRegex, (match, column, value) => {
        paramCount++;
        values.push(value);
        return `WHERE ${column} = $${paramCount}`;
    });

    // For LIKE clauses
    const whereLikeRegex = /WHERE\s+(\w+)\s+LIKE\s+'([^']+)'/gi;

    text = text.replace(whereLikeRegex, (match, column, value) => {
        paramCount++;
        values.push(value);
        return `WHERE ${column} LIKE $${paramCount}`;
    });

    return { text, values };
}


async function saveQueryHistory(naturalQuery, sqlQuery, resultCount, executionTime) {
    // Create history table if it doesn't exist
    await ensureHistoryTableExists();

    const query = `
    INSERT INTO query_history 
    (natural_query, sql_query, result_count, execution_time_ms)
    VALUES ($1, $2, $3, $4)
    RETURNING id, created_at
  `;

    try {
        const result = await db.query(query, [
            naturalQuery,
            sqlQuery,
            resultCount,
            executionTime
        ]);

        return result.rows[0];
    } catch (error) {
        console.error('Failed to save query history:', error);
        // Non-critical error, don't throw
        return null;
    }
}


async function ensureHistoryTableExists() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS query_history (
      id SERIAL PRIMARY KEY,
      natural_query TEXT NOT NULL,
      sql_query TEXT NOT NULL,
      result_count INTEGER NOT NULL,
      execution_time_ms INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_favorite BOOLEAN DEFAULT FALSE
    )
  `;

    try {
        await db.query(createTableQuery);
    } catch (error) {
        console.error('Failed to create history table:', error);
    }
}

module.exports = {
    executeQuery,
    saveQueryHistory,
    ensureHistoryTableExists
};