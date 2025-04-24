export function convertToCsv(data) {
    if (!data || data.length === 0) {
        return '';
    }

    // Get column headers from the first row
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');

    // Convert each row to CSV format
    const rows = data.map(row =>
        headers
            .map(header => {
                const value = row[header];


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
            })
            .join(',')
    );

    return [headerRow, ...rows].join('\n');
}
