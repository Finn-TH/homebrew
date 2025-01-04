import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Get the model
export const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

// Helper for chat initialization
export const initializeChat = (model: any) => {
  return model.startChat({
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      // Add other safety settings as needed
    ],
  });
};
