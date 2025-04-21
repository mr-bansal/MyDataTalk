
function convertToCsv(data) {
    if (!data || data.length === 0) {
        return '';
    }

    // Get column headers from the first row
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');

    // Convert each row to CSV format
    const rows = data.map(row => {
        return headers.map(header => {
            const value = row[header];

            // Handle different data types properly
            if (value === null || value === undefined) {
                return '';
            } else if (typeof value === 'string') {
                // Escape double quotes and wrap in quotes
                return `"${value.replace(/"/g, '""')}"`;
            } else if (typeof value === 'object') {
                // For objects/arrays, convert to JSON string and escape
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            } else {
                return value;
            }
        }).join(',');
    });

    // Combine header and rows
    return [headerRow, ...rows].join('\n');
}

module.exports = {
    convertToCsv,
};