const schema = require('../models/schema');

// List of potentially dangerous SQL keywords
const DANGEROUS_KEYWORDS = [
    'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE',
    'INSERT', 'UPDATE', 'GRANT', 'REVOKE', 'EXECUTE'
];


function validateSqlQuery(sqlQuery) {
    if (!sqlQuery || sqlQuery.trim() === '') {
        return { isValid: false, error: 'Empty SQL query' };
    }

    // Check for dangerous keywords
    const containsDangerousKeyword = DANGEROUS_KEYWORDS.some(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'i').test(sqlQuery)
    );

    if (containsDangerousKeyword) {
        return {
            isValid: false,
            error: 'Query contains potentially destructive operations'
        };
    }

    // Verify the query only accesses the COUNTRY table
    const tableRegex = /\bFROM\s+(?!COUNTRY\b)(\w+)/i;
    const tableMatch = sqlQuery.match(tableRegex);

    if (tableMatch) {
        return {
            isValid: false,
            error: `Query attempts to access unauthorized table: ${tableMatch[1]}`
        };
    }

    // Check for multiple statements
    if (sqlQuery.includes(';') && sqlQuery.lastIndexOf(';') < sqlQuery.length - 1) {
        return {
            isValid: false,
            error: 'Multiple SQL statements are not allowed'
        };
    }

    return { isValid: true };
}


function sqlValidationMiddleware(req, res, next) {
    const { sqlQuery } = req.body;

    const validation = validateSqlQuery(sqlQuery);

    if (!validation.isValid) {
        return res.status(400).json({
            error: 'SQL validation failed',
            message: validation.error
        });
    }

    next();
}

module.exports = {
    validateSqlQuery,
    sqlValidationMiddleware
};