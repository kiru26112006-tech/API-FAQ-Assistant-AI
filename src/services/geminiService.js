const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
  }

  return new GoogleGenAI({ apiKey });
};


// Generate AI Answer
const generateAnswer = async (question) => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are a helpful assistant. Provide a clear, concise, and direct answer to the following question.

Question: ${question}`,
    });

    if (!response || !response.text) {
      throw new Error('No response text received from Gemini API');
    }

    return response.text.trim();

  } catch (error) {
    console.error('Error in geminiService.generateAnswer:', error);
    throw new Error(`AI Answer Generation failed: ${error.message}`);
  }
};


// Generate FAQ
const generateFAQ = async (topic) => {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate a single frequently asked question (FAQ) and its comprehensive answer regarding the topic: "${topic}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING',
              description: 'A clear, common question that a user would ask about the topic.'
            },
            answer: {
              type: 'STRING',
              description: 'A detailed, helpful, and accurate answer explaining the question.'
            }
          },
          required: ['question', 'answer'],
        },
      },
    });

    if (!response || !response.text) {
      throw new Error('No response received from Gemini API');
    }

    return JSON.parse(response.text);

  } catch (error) {
    console.error('Error in geminiService.generateFAQ:', error);
    throw new Error(`AI FAQ Generation failed: ${error.message}`);
  }
};


module.exports = {
  generateAnswer,
  generateFAQ,
};