import { generateContent } from '../config/ai.js';
import { getSchemaDescription } from '../models/schema.js';

async function buildDynamicPrompt() {
    try {
        const schemaDescription = await getSchemaDescription();
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
    let sqlQuery = '';
    let confidence = 100;

    const codeBlockMatch = response.match(/```(?:sql)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
        sqlQuery = codeBlockMatch[1].trim();
    } else {
        for (const line of response.split('\n')) {
            if (line.trim().toUpperCase().startsWith('SELECT')) {
                sqlQuery = line.trim();
                break;
            }
        }
    }

    const confidenceMatch = response.match(/confidence[:\s]+(\d+)/i);
    if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1], 10);
    }

    sqlQuery = sqlQuery.replace(/--[\s\S]*?(?=\n|$)/, '').trim();
    return { sqlQuery, confidence };
}

async function translateToSql(userQuery) {
    try {
        const prompt = await buildDynamicPrompt();
        const fullPrompt = prompt + userQuery;
        const response = await generateContent(fullPrompt);
        return parseAiResponse(response);
    } catch (error) {
        console.error('Failed to translate query:', error);
        throw new Error('AI translation failed');
    }
}

async function generateClarificationRequest(userQuery, attemptedSql) {
    const clarificationPrompt = `
I tried to translate this English query to SQL: "${userQuery}"

My attempted SQL was: "${attemptedSql}"

Please generate 2-3 clarifying questions I should ask the user to help me understand what they're looking for.
Format each question on a new line with a number.
`;
    try {
        return await generateContent(clarificationPrompt);
    } catch (error) {
        console.error('Failed to generate clarification request:', error);
        return "Could you please clarify what you're looking for?";
    }
}

export default {
    translateToSql,
    generateClarificationRequest,
    buildDynamicPrompt
};
