function analyzeQuery(sqlQuery) {
    if (!sqlQuery) return null;

    // Normalize query: remove extra whitespace, make uppercase for analysis
    const normalizedQuery = sqlQuery.replace(/\s+/g, ' ').trim();
    const upperQuery = normalizedQuery.toUpperCase();

    // Determine query type
    let queryType = 'UNKNOWN';
    if (upperQuery.startsWith('SELECT')) queryType = 'SELECT';
    else if (upperQuery.startsWith('INSERT')) queryType = 'INSERT';
    else if (upperQuery.startsWith('UPDATE')) queryType = 'UPDATE';
    else if (upperQuery.startsWith('DELETE')) queryType = 'DELETE';

    // Extract tables (basic approach - a full parser would be more complex)
    const tables = [];

    if (queryType === 'SELECT') {
        // Extract table after FROM
        const fromMatch = upperQuery.match(/FROM\s+([^\s,;]+)/);
        if (fromMatch && fromMatch[1]) {
            tables.push(fromMatch[1].toLowerCase());
        }

        // Extract tables after JOIN
        const joinPattern = /JOIN\s+([^\s,;]+)/g;
        let joinMatch;
        while ((joinMatch = joinPattern.exec(upperQuery)) !== null) {
            tables.push(joinMatch[1].toLowerCase());
        }
    }

    // Extract columns for SELECT queries
    let columns = [];
    if (queryType === 'SELECT') {
        // Get everything between SELECT and FROM
        const selectMatch = upperQuery.match(/SELECT\s+(.*?)\s+FROM/s);
        if (selectMatch && selectMatch[1]) {
            // Split by commas, but handle functions like COUNT(*)
            let inFunction = false;
            let currentCol = '';
            const selectPart = selectMatch[1];

            for (let i = 0; i < selectPart.length; i++) {
                const char = selectPart[i];

                if (char === '(') inFunction = true;
                else if (char === ')') inFunction = false;

                if (char === ',' && !inFunction) {
                    columns.push(currentCol.trim());
                    currentCol = '';
                } else {
                    currentCol += char;
                }
            }

            // Add the last column
            if (currentCol.trim()) {
                columns.push(currentCol.trim());
            }
        }
    }

    // Extract WHERE conditions
    const whereMatch = upperQuery.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|HAVING|LIMIT|$)/s);
    const whereConditions = whereMatch ? whereMatch[1].trim() : null;

    // Extract parameters (placeholder for parameterization)
    const parameters = [];
    // Find string literals: 'value'
    const stringLiteralPattern = /'([^']*)'/g;
    let stringMatch;
    while ((stringMatch = stringLiteralPattern.exec(normalizedQuery)) !== null) {
        parameters.push({
            type: 'string',
            value: stringMatch[1],
            position: stringMatch.index
        });
    }

    // Find numeric literals
    const numericPattern = /\b\d+(\.\d+)?\b/g;
    let numMatch;
    while ((numMatch = numericPattern.exec(normalizedQuery)) !== null) {
        // Make sure it's not part of a column or table name
        const prevChar = normalizedQuery[numMatch.index - 1] || ' ';
        const nextChar = normalizedQuery[numMatch.index + numMatch[0].length] || ' ';

        if (/\s|[()=<>]/.test(prevChar) && /\s|[()=<>,;]/.test(nextChar)) {
            parameters.push({
                type: 'number',
                value: numMatch[0],
                position: numMatch.index
            });
        }
    }

    return {
        queryType,
        tables,
        columns,
        whereConditions,
        parameters,
        original: sqlQuery,
        normalized: normalizedQuery
    };
}


function parameterizeQuery(sqlQuery) {
    const analysis = analyzeQuery(sqlQuery);
    if (!analysis) return { text: sqlQuery, values: [] };

    // Only handle SELECT queries for now (for safety)
    if (analysis.queryType !== 'SELECT') {
        return { text: sqlQuery, values: [] };
    }

    let parameterizedQuery = sqlQuery;
    const values = [];

    // Sort parameters by position in descending order to avoid index shifting
    const sortedParams = [...analysis.parameters].sort((a, b) => b.position - a.position);

    // Replace each parameter with a placeholder
    for (let i = 0; i < sortedParams.length; i++) {
        const param = sortedParams[i];
        const placeholder = `$${sortedParams.length - i}`;

        if (param.type === 'string') {
            const regex = new RegExp(`'${param.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}'`, 'g');
            parameterizedQuery = parameterizedQuery.replace(regex, placeholder);
            values.unshift(param.value);
        } else if (param.type === 'number') {
            // Need to be careful with numbers to not replace parts of identifiers
            const valuePos = parameterizedQuery.indexOf(param.value, param.position);
            if (valuePos !== -1) {
                parameterizedQuery =
                    parameterizedQuery.substring(0, valuePos) +
                    placeholder +
                    parameterizedQuery.substring(valuePos + param.value.length);
                values.unshift(Number(param.value));
            }
        }
    }

    return { text: parameterizedQuery, values };
}

module.exports = {
    analyzeQuery,
    parameterizeQuery
};