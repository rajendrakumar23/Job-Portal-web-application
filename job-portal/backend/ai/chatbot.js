import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (message) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(message);

  return result.response.text();
};