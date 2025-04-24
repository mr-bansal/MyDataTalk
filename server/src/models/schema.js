import db from '../config/database.js';

export async function getCountryTableSchema() {
    const query = `
    SELECT column_name, data_type, character_maximum_length, is_nullable
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = 'country'
    ORDER BY ordinal_position;
  `;
    try {
        const rows = await db.unsafe(query);
        return rows;
    } catch (error) {
        console.error('Failed to fetch schema information:', error);
        throw new Error('Database schema introspection failed');
    }
}

export async function getSchemaDescription() {
    const columns = await getCountryTableSchema();
    return columns
        .map(col => {
            let typeInfo = col.data_type;
            if (col.character_maximum_length) {
                typeInfo += `(${col.character_maximum_length})`;
            }
            return `${col.column_name} (${typeInfo})`;
        })
        .join(', ');
}

export async function getAllTables() {
    const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
    try {
        const rows = await db.unsafe(query);
        return rows.map(row => row.table_name);
    } catch (error) {
        console.error('Failed to fetch tables:', error);
        throw new Error('Database table introspection failed');
    }
}
