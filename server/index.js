console.log("reached -1");
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');
const prompt = "You are an expert in converting English questions to SQL query! The sql code should not have ``` in beginning or end and sql word in output, The SQL database has the name COUNTRY and has the following columns - CODE, NAME, CONTINENT, REGION, SURFACEAREA, INDEPYYEAR, POPULATION, LIFEEXPECTANCY, GNP, GNPOLD, LOCALNAME, GOVERNMENT FORM, HEADOFSTATE, CAPITAL, CODE2 \n\nFor example, \nExample 1 - How many entries of records are present ?,the SQL command will be something like this SELECT COUNT(*) FROM COUNTRY;\nExample 2 - Tell me all the countries in continent Asia?, the SQL command will be something like this SELECT * FROM COUNTRY where CONTINENT = 'Asia';, keep in mind the single quotes around Asia and other text, the query is :  ";

const app = express();
app.use(cors());
const port = 5000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.json());

// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_PORT:', process.env.DB_PORT);


console.log("reached 0");
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 7714,
});
console.log("reached 0.5");
client.connect();

function extractSqlQuery(str) {
    // Regular expression to match the code block with "sql" (case-insensitive)
    const regex = /`sql\s*(.*?)\s*`/i;

    // Match the regex against the string
    const match = str.match(regex);

    // If there's a match, return the captured group (the query)
    if (match) {
        return match[1].trim();
    } else {
        return "";
    }
}


app.post('/query', async (req, res) => {
    const { query } = req.body;
    console.log("reached 1");
    try {
        const geminiResponse = await model.generateContent(prompt + query);


        const response = await geminiResponse.response.text();
        console.log("reached 2");
        sqlQuery = extractSqlQuery(response);
        console.log(sqlQuery);
        const result = await client.query(sqlQuery);
        console.log("reached 3");

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred while processing your query.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port} `);
});
