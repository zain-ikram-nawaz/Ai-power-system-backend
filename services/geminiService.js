const { GoogleGenAI, Type } = require("@google/genai");
const ApiError = require("../utils/ApiError");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const TUTOR_PERSONA =
  "You are an encouraging, knowledgeable educational tutor helping a student study. Keep a friendly, clear, and academically accurate tone.";

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      minItems: 3,
      maxItems: 5,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4,
          },
          correctAnswer: { type: Type.STRING },
        },
        required: ["question", "options", "correctAnswer"],
      },
    },
  },
  required: ["questions"],
};

const callGemini = async (config) => {
  try {
    return await ai.models.generateContent(config);
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new ApiError(502, "AI service is temporarily unavailable. Please try again in a moment.");
  }
};

const generateSummary = async (input) => {
  const response = await callGemini({
    model: MODEL,
    contents: `Summarize the following topic/notes academically in simple language, in approximately 150-250 words:\n\n${input}`,
    config: {
      systemInstruction: TUTOR_PERSONA,
      temperature: 0.4,
    },
  });
  return response.text.trim();
};

const generateExplanation = async (input) => {
  const response = await callGemini({
    model: MODEL,
    contents: `Explain the following topic like you are teaching a complete beginner. Use simple English and at least one concrete example:\n\n${input}`,
    config: {
      systemInstruction: TUTOR_PERSONA,
      temperature: 0.6,
    },
  });
  return response.text.trim();
};

const generateQuiz = async (input) => {
  const response = await callGemini({
    model: MODEL,
    contents: `Generate 3 to 5 multiple-choice questions to test understanding of the following topic/notes. Each question must have exactly four options and clearly indicate the correct answer (the correctAnswer must exactly match one of the options):\n\n${input}`,
    config: {
      systemInstruction: TUTOR_PERSONA,
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: quizSchema,
    },
  });

  try {
    const parsed = JSON.parse(response.text);
    return parsed.questions;
  } catch (error) {
    throw new ApiError(502, "AI returned an unexpected quiz format. Please try again.");
  }
};

const chatWithTutor = async (message, history = []) => {
  const chat = ai.chats.create({
    model: MODEL,
    history: history.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.text }],
    })),
    config: {
      systemInstruction:
        "You are an educational tutor. Answer naturally, clearly, and helpfully as if guiding a student through their studies.",
      temperature: 0.7,
    },
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini chat error:", error.message);
    throw new ApiError(502, "AI service is temporarily unavailable. Please try again in a moment.");
  }
};

module.exports = {
  generateSummary,
  generateExplanation,
  generateQuiz,
  chatWithTutor,
};
