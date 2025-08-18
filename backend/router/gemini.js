import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Response from '../models/diff/Response.js';
import router from 'express';
import dotenv from 'dotenv';

// Load environment variables if needed
dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create the router instance
const appRouter = router.Router();

appRouter.post('/gemini', async (req, res) => {
  const { surah, startAyat, endAyat } = req.body;
 

  const prompt = `Provide a detailed explanation in Bengali for Surah ${surah}, Ayat ${startAyat}-${endAyat}.
  Include:
  1.Relevant other quranic verses with each ayat from start ayat to end ayat atleast two for each and why relevant with explanation
  4. Relevant Hadith with reference for start ayat to end ayat atleast 1 for each ayat
  5. Practical life lessons for recent time any context

`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const newResponse = new Response({
      prompt: `Surah ${surah}, Ayat ${startAyat}-${endAyat}`,
      response: text,
    });
    await newResponse.save();

    res.json({ response: text });
  } catch (error) {
    console.error("Full Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message
    });
  }
});

export default appRouter;