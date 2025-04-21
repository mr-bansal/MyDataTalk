require('dotenv').config()
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to PostgreSQL database');
        release();
    }
});


module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};