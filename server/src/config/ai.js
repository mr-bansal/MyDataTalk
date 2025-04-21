require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.0-flash";

module.exports = {
    generateContent: async (prompt) => {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error('AI generation error:', error);
            throw new Error('Failed to generate AI response');
        }
    }
};