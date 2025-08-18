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
  let start = parseInt(startAyat); // Ensure these are numbers
  const end = parseInt(endAyat);
  let text = "Details"; // Initialize as string
  
  try {
    // Validate input
    if (!surah || isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    const responses = []; // Store all responses
    
    while (start <= end) {
      const prompt = `Provide an exhaustive Bengali explanation of **Surah ${surah}, Ayat ${start}** with *primary focus* on:  
1. **Relevant Hadiths** (with full references)  
2. **Related Quranic verses** (with explanations)  
3. **Present-day applications** (practical examples)  

Structure your response as follows:  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
**🔷 *আয়াতের সারসংক্ষেপ* (Brief Summary)**  
- Arabic text + Bengali translation  
- *Key theme*: 1-2 lines  

**🔷 *প্রাসঙ্গিক হাদীস* (Relevant Hadiths)**  
- **হাদীস ১**:  
  - Full Arabic text (if short) + Bengali translation  
  - Reference *(e.g., সহীহ বুখারী, বই ২, হাদীস ৪৫৬)*  
  - Connection to the ayat *(how it explains/expands the meaning)*  
  - Modern relevance *(e.g., how to apply this today)*  

- **হাদীস ২**: [Same structure]  
*(Include 3-5 authentic Hadiths minimum)*  

**🔷 *সম্পর্কিত কুরআনের আয়াত* (Related Quranic Verses)**  
- **আয়াত ১** (e.g., Surah Al-Baqarah:30):  
  - Bengali translation  
  - Why it’s connected *(historical/linguistic/thematic link)*  
  - Key lesson derived from comparing both verses  

- **আয়াত ২**: [Same structure]  
*(Include 2-4 related Quranic verses)*  

**🔷 *আধুনিক প্রেক্ষাপটে প্রযোজ্যতা* (Modern Applications)**  
- **সমস্যা ১**: e.g., "অতিরিক্ত গীবত (Backbiting) on social media"  
  - How the ayat addresses it  
  - Practical steps to avoid (with examples)  

- **সমস্যা ২**: e.g., "যুবকদের ধৈর্য্য হারানো (Impatience)"  
  - Solution from the ayat + supporting Hadith  
  - Real-life action plan  
*(Give 3-5 current issues with solutions)*  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
**নির্দেশনা (Guidelines):**  
- Use **simple but impactful Bengali** (avoid complex terms).  
- Cite **only authentic Hadiths** (Sahih Bukhari/Muslim, etc.).  
- For modern issues: Focus on **social media, family conflicts, youth challenges, workplace ethics**.  
- Highlight **1-2 linguistic miracles** (if applicable).  
- End with **a powerful dua/practical challenge** (e.g., "Try this for 7 days").  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━  `;

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        responses.push({
          ayat: start,
          response: responseText
        });
        
        // Save each response to database
        const newResponse = new Response({
          prompt: `Surah ${surah}, Ayat ${start}`,
          response: responseText,
        });
        await newResponse.save();
        
      } catch (error) {
        console.error(`Error processing Ayat ${start}:`, error);
        responses.push({
          ayat: start,
          error: `Failed to generate response for Ayat ${start}`
        });
      }
      
      start++;
    }
    
    // Send all responses at once after loop completes
    res.json({ 
      surah,
      startAyat: startAyat,
      endAyat: endAyat,
      responses 
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Server error processing request",
      details: error.message
    });
  }
});

export default appRouter;