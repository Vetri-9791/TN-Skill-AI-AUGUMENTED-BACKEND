const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Fallback to gemini-3.8-flash if env is missing or invalid
  const modelName = process.env.GEMINI_MODEL === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : (process.env.GEMINI_MODEL || 'gemini-3.8-flash');

  if (!apiKey) {
    throw new Error('Gemini error: API key not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Gemini error: empty response');
    }

    return text;
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    console.error('Gemini API Error:', message);
    throw new Error(`Gemini error: ${message}`);
  }
};

module.exports = {
  callGemini,
};