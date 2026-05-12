import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    const completion =
      await openai.chat.completions.create({

        model: "openai/gpt-3.5-turbo",

        messages: [

          {
            role: "system",
            content:
              "You are an AI Career Assistant.",
          },

          {
            role: "user",
            content: message,
          },

        ],

      });

    res.json({

      success: true,

      reply:
        completion.choices[0].message.content,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};