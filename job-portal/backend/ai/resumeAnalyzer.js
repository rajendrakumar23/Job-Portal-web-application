import fs from "fs";
import { PdfReader } from "pdfreader";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const extractTextFromPDF = (path) => {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseFileItems(
      path,
      (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          resolve(text);
        } else if (item.text) {
          text += item.text + " ";
        }
      }
    );
  });
};

export const analyzeResume = async (
  resumePath
  
) => {
  const resumeText =
    await extractTextFromPDF(resumePath);

  const prompt = `
You are an AI Resume Analyzer.

Analyze this resume and provide:

1. Resume score out of 100
2. Skills found
3. Missing skills
4. Improvement suggestions
5. Short professional summary

Resume:
${resumeText}
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(
    prompt
  );

  return result.response.text();
};