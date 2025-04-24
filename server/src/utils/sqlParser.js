export function analyzeQuery(sqlQuery) {
    if (!sqlQuery) return null;

    // Normalize query and uppercase for analysis
    const normalized = sqlQuery.replace(/\s+/g, ' ').trim();
    const upper = normalized.toUpperCase();


    let queryType = 'UNKNOWN';
    if (upper.startsWith('SELECT')) queryType = 'SELECT';
    else if (upper.startsWith('INSERT')) queryType = 'INSERT';
    else if (upper.startsWith('UPDATE')) queryType = 'UPDATE';
    else if (upper.startsWith('DELETE')) queryType = 'DELETE';

    // Extract tables
    const tables = [];
    if (queryType === 'SELECT') {
        const fromMatch = upper.match(/FROM\s+([^\s,;]+)/);
        if (fromMatch) tables.push(fromMatch[1].toLowerCase());

        const joinPattern = /JOIN\s+([^\s,;]+)/g;
        let jm;
        while ((jm = joinPattern.exec(upper)) !== null) {
            tables.push(jm[1].toLowerCase());
        }
    }

    // Extract columns for SELECT
    let columns = [];
    if (queryType === 'SELECT') {
        const selMatch = upper.match(/SELECT\s+(.*?)\s+FROM/s);
        if (selMatch) {
            const part = selMatch[1];
            let inFn = false, cur = '';
            for (const ch of part) {
                if (ch === '(') inFn = true;
                else if (ch === ')') inFn = false;

                if (ch === ',' && !inFn) {
                    columns.push(cur.trim());
                    cur = '';
                } else {
                    cur += ch;
                }
            }
            if (cur.trim()) columns.push(cur.trim());
        }
    }

    // Extract WHERE conditions
    const whereMatch = upper.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|HAVING|LIMIT|$)/s);
    const whereConditions = whereMatch ? whereMatch[1].trim() : null;

    // Extract parameters
    const parameters = [];
    const strPat = /'([^']*)'/g;
    let sm;
    while ((sm = strPat.exec(normalized)) !== null) {
        parameters.push({ type: 'string', value: sm[1], position: sm.index });
    }
    const numPat = /\b\d+(\.\d+)?\b/g;
    let nm;
    while ((nm = numPat.exec(normalized)) !== null) {
        const prev = normalized[nm.index - 1] || ' ';
        const next = normalized[nm.index + nm[0].length] || ' ';
        if (/\s|[()=<>]/.test(prev) && /\s|[()=<>,;]/.test(next)) {
            parameters.push({ type: 'number', value: nm[0], position: nm.index });
        }
    }

    return {
        queryType,
        tables,
        columns,
        whereConditions,
        parameters,
        original: sqlQuery,
        normalized
    };
}

export function parameterizeQuery(sqlQuery) {
    const analysis = analyzeQuery(sqlQuery);
    if (!analysis || analysis.queryType !== 'SELECT') {
        return { text: sqlQuery, values: [] };
    }

    let text = sqlQuery;
    const values = [];
    // Sort parameters descending by position
    const sorted = [...analysis.parameters].sort((a, b) => b.position - a.position);

    sorted.forEach((p, i) => {
        const placeholder = `$${sorted.length - i}`;
        if (p.type === 'string') {
            const esc = p.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            text = text.replace(new RegExp(`'${esc}'`, 'g'), placeholder);
            values.unshift(p.value);
        } else if (p.type === 'number') {
            const idx = text.indexOf(p.value, p.position);
            if (idx !== -1) {
                text = text.slice(0, idx) + placeholder + text.slice(idx + p.value.length);
                values.unshift(Number(p.value));
            }
        }
    });

    return { text, values };
}
