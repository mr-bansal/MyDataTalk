import db from '../config/database.js';
import { validateSqlQuery } from '../middleware/sqlValidator.js';

function attemptToParameterize(sqlQuery, existingParams = []) {
    let paramCount = existingParams.length;
    let text = sqlQuery;
    const values = [...existingParams];

    const whereValueRegex = /WHERE\s+(\w+)\s*=\s*'([^']+)'/gi;
    text = text.replace(whereValueRegex, (match, column, value) => {
        paramCount++;
        values.push(value);
        return `WHERE ${column} = $${paramCount}`;
    });

    const whereLikeRegex = /WHERE\s+(\w+)\s+LIKE\s+'([^']+)'/gi;
    text = text.replace(whereLikeRegex, (match, column, value) => {
        paramCount++;
        values.push(value);
        return `WHERE ${column} LIKE $${paramCount}`;
    });

    return { text, values };
}

export async function executeQuery(sqlQuery, params = []) {
    const { isValid, error } = validateSqlQuery(sqlQuery);
    if (!isValid) {
        throw new Error(error);
    }

    const { text, values } = attemptToParameterize(sqlQuery, params);
    console.log('Executing query:', text);
    if (values.length) console.log('With parameters:', values);

    const start = Date.now();
    const rows = await db.unsafe(text, ...values);
    const executionTime = Date.now() - start;

    return {
        rows,
        rowCount: rows.length,
        executionTime
    };
}

export default {
    executeQuery
};
