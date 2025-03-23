import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration for Netlify Deployment
app.use(cors({
  origin: '*', // OR use your Netlify frontend URL: 'https://your-frontend.netlify.app'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Log Environment Variables (For Debugging, Remove in Production)
console.log('Environment Variables:', {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '***' : 'MISSING',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '***' : 'MISSING'
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Gemini AI Route
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing prompt' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Gemini Error Details:', error);
    res.status(500).json({
      error: 'Error processing request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Deepseek AI Route
app.post('/api/deepseek', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing prompt' });
    }

    const client = new OpenAI({
      baseURL: 'https://api.aimlapi.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      timeout: 15000, // Add timeout
    });

    const completion = await client.chat.completions.create({
      model: 'deepseek/deepseek-r1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response format from Deepseek');
    }

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Deepseek Error Details:', error);
    res.status(500).json({
      error: 'Error processing request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Deployment Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
