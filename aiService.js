import { GoogleGenAI } from '@google/genai';

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const model = () => process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export const generateFAQ = async (topic) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: model(),
    contents: `Create one high-quality customer-support FAQ for this topic: ${topic}. Return only valid JSON with exactly these keys: question, answer, category. Keep the answer practical and concise.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['question', 'answer', 'category']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateAnswer = async (question, context = '') => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: model(),
    contents: `You are a customer-support assistant. Answer the user's question using the supplied FAQ context when relevant. Do not invent company-specific facts.\n\nFAQ context:\n${context}\n\nQuestion:\n${question}`
  });
  return response.text;
};
