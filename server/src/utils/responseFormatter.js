export function formatSuccessResponse(data, message = null) {
    const response = {
        success: true,
        timestamp: new Date().toISOString(),
    };

    if (message) {
        response.message = message;
    }

    if (data !== undefined) {
        response.data = data;
    }

    return response;
}

export function formatErrorResponse(message, statusCode = 500, details = null) {
    const response = {
        success: false,
        error: {
            message: message || 'An unexpected error occurred',
            status: statusCode,
        },
        timestamp: new Date().toISOString(),
    };

    if (details) {
        response.error.details = details;
    }

    return response;
}

export function enhanceQueryResults(rows, metadata = {}) {
    const result = {
        data: rows,
        count: rows.length,
        timestamp: new Date().toISOString(),
    };

    // Add column metadata
    if (rows.length > 0) {
        const sampleRow = rows[0];
        const columns = Object.keys(sampleRow).map(key => {
            let dataType = typeof sampleRow[key];
            if (dataType === 'object') {
                dataType = sampleRow[key] === null
                    ? 'null'
                    : Array.isArray(sampleRow[key])
                        ? 'array'
                        : 'object';
            }
            return { name: key, type: dataType };
        });
        result.columns = columns;
    }

    // Add summary statistics for numeric columns
    if (rows.length > 0) {
        const numericSummary = {};
        const sampleRow = rows[0];

        Object.keys(sampleRow).forEach(key => {
            if (typeof sampleRow[key] === 'number') {
                const values = rows.map(r => r[key]).filter(v => v != null);
                if (values.length > 0) {
                    const sum = values.reduce((a, b) => a + b, 0);
                    const avg = sum / values.length;
                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    numericSummary[key] = { min, max, avg, sum };
                }
            }
        });

        if (Object.keys(numericSummary).length > 0) {
            result.summary = numericSummary;
        }
    }

    // Merge additional metadata
    if (metadata && typeof metadata === 'object') {
        Object.assign(result, metadata);
    }

    return result;
}
