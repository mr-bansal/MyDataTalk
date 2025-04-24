import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.0-flash';

export async function generateContent(prompt) {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error('Failed to generate AI response');
    }
}
