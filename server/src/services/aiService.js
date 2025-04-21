const ai = require('../config/ai');
const schemaModel = require('../models/schema');


async function buildDynamicPrompt() {
    try {
        // Get schema description for the COUNTRY table
        const schemaDescription = await schemaModel.getSchemaDescription();

        // Build the dynamic prompt with the schema information
        return `You are an expert in converting English questions to SQL query!
The SQL database has a table named COUNTRY with the following columns:
${schemaDescription}

The SQL code should not have \`\`\` in beginning or end and sql word in output.
If you are not sure about the query, provide a confidence score between 0-100.

For example:
Example 1 - How many entries of records are present?
The SQL command will be: SELECT COUNT(*) FROM COUNTRY;

Example 2 - Tell me all the countries in continent Asia?
The SQL command will be: SELECT * FROM COUNTRY WHERE CONTINENT = 'Asia';

Keep in mind:
1. Use single quotes around text values
2. Only access the COUNTRY table
3. Keep the query simple and focused on answering the question
4. Avoid using semicolons except at the end of the query

The query is: `;
    } catch (error) {
        console.error('Failed to build dynamic prompt:', error);
        return `You are an expert in converting English questions to SQL query!
The SQL database has a table named COUNTRY with columns like CODE, NAME, CONTINENT, 
REGION, SURFACEAREA, INDEPYEAR, POPULATION, LIFEEXPECTANCY, GNP, and more.

The SQL code should not have \`\`\` in beginning or end and sql word in output.
If you are not sure about the query, provide a confidence score between 0-100.

For example:
Example 1 - How many entries of records are present?
The SQL command will be: SELECT COUNT(*) FROM COUNTRY;

Example 2 - Tell me all the countries in continent Asia?
The SQL command will be: SELECT * FROM COUNTRY WHERE CONTINENT = 'Asia';

Keep in mind to use single quotes around text values. The query is: `;
    }
}


function parseAiResponse(response) {
    // Extract SQL query - handle both with and without markdown code blocks
    let sqlQuery = '';
    let confidence = 100; // Default high confidence

    // Extract SQL query from response
    const codeBlockMatch = response.match(/```(?:sql)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
        sqlQuery = codeBlockMatch[1].trim();
    } else {
        // If no code block, try to extract what looks like a SQL query
        const lines = response.split('\n');
        for (const line of lines) {
            if (line.trim().toUpperCase().startsWith('SELECT')) {
                sqlQuery = line.trim();
                break;
            }
        }
    }

    // Extract confidence score if present
    const confidenceMatch = response.match(/confidence[:\s]+(\d+)/i);
    if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1]);
    }

    // If query includes explanation comment, remove it
    sqlQuery = sqlQuery.replace(/--[\s\S]*?(?=\n|$)/, '').trim();

    return { sqlQuery, confidence };
}


async function generateClarificationRequest(userQuery, attemptedSql) {
    const clarificationPrompt = `
    I tried to translate this English query to SQL: "${userQuery}"
    
    My attempted SQL was: "${attemptedSql}"
    
    Please generate 2-3 clarifying questions I should ask the user to help me understand what they're looking for.
    Format each question on a new line with a number.
  `;

    try {
        const response = await ai.generateContent(clarificationPrompt);
        return response;
    } catch (error) {
        console.error('Failed to generate clarification request:', error);
        return "Could you please clarify what you're looking for?";
    }
}


async function translateToSql(userQuery) {
    try {
        const prompt = await buildDynamicPrompt();
        const fullPrompt = prompt + userQuery;

        const response = await ai.generateContent(fullPrompt);
        return parseAiResponse(response);
    } catch (error) {
        console.error('Failed to translate query:', error);
        throw new Error('AI translation failed');
    }
}

module.exports = {
    translateToSql,
    generateClarificationRequest,
    buildDynamicPrompt
};