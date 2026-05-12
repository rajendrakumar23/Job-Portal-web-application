// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );

// export const chatbot = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         message: "Message is required",
//       });
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });

//     const result = await model.generateContent(message);

//     const response = result.response.text();

//     res.status(200).json({
//       success: true,
//       reply: response,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "AI Error",
//     });
//   }
// };

import express from "express";

import { chatbot } from "../controllers/ai.controller.js";

import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({

  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: "https://openrouter.ai/api/v1",

});


// ==============================
// AI CHATBOT
// ==============================

router.post("/chat", chatbot);


// ==============================
// AI RESUME ANALYZER
// ==============================

router.post(

  "/analyze-text-resume",

  async (req, res) => {

    try {

      console.log(
        "Resume Analyze API Hit"
      );

      const { resumeText } = req.body;

      if (!resumeText) {

        return res.status(400).json({

          success: false,

          message:
            "Resume text required",

        });

      }

      const prompt = `
You are an AI Resume Analyzer.

Analyze this resume professionally.

Give:

1. Resume score out of 100
2. Technical skills found
3. Missing skills
4. Improvement suggestions
5. ATS optimization tips
6. Short professional summary

Resume:
${resumeText}
`;

      const completion =
        await openai.chat.completions.create({

          model:
            "openai/gpt-3.5-turbo",

          messages: [

            {
              role: "system",

              content:
                "You are a professional AI Resume Analyzer.",
            },

            {
              role: "user",

              content: prompt,
            },

          ],

        });

      const response =
        completion.choices[0].message.content;

      res.json({

        success: true,

        analysis: response,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message ||
          "Resume analysis failed",

      });

    }

  }

);

export default router;