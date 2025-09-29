import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuizExplanation = async (req, res) => {
  try {
    const prompt = `
    Explain in two sentence why this "${req.body.questionText}" Question's correct answer is:${req.body.correctAnswer},
    and when User's Answer: ${req.body.userAnswer} could have been correct`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    
    res.json({ 
      success: true,
      explanation: result.response.text()
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation"
    });
  }
};

