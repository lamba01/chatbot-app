import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 100,
    });

    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
