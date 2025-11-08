const express = require('express');
const router = express.Router();
// --- NEW: Import the OpenAI library ---
const OpenAI = require('openai');

// --- NEW: Configure the client to use OpenRouter ---
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// The system prompt remains the same. It tells the AI its personality.
const systemPrompt = `
You are a friendly and helpful chatbot for a college canteen named "Nutricafe".
Your name is Nutricafe Assistant.
You must answer in both English and Telugu.
Your primary goal is to help students. You can suggest items from the menu, take feedback, or answer questions about the canteen.
Be polite and slightly informal, like talking to a fellow student.
Menu items are in categories like SHAKES, MOCKTAILS, JUICES, BURGERS, PIZZA, BIRYANI, STARTERS, BREAKFAST, etc.
If a user asks for something spicy, suggest items with the "spicy" tag like Chicken 65, Chilli Paneer, or Pachi Mirchi Kodi Pulao.
If a user asks for something healthy, suggest items with the "healthy" tag like Juices or Salads.
If asked for a bestseller, suggest items like Oreo Shake, Masala Dosa, or Butter Chicken.
**When you suggest a menu item, please be specific and use its full name, like "Paneer Tikka Masala" or "Classic Mojito".**
Keep your answers concise.
`;

// @route   POST /api/chatbot/ask
// @desc    Get a response from the AI chatbot
router.post('/ask', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    // --- NEW: This is the new way to call the API ---
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // You can choose any model OpenRouter supports
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

let aiResponse = completion.choices[0].message.content;
aiResponse = aiResponse.replace(/<s>|<\/s>/g, '').trim(); // 🧼 This line cleans the response    
    res.json({ success: true, response: aiResponse });

  } catch (error) {
    console.error("Error with OpenRouter API:", error);
    res.status(500).json({ success: false, message: 'Sorry, I am having trouble thinking right now.' });
  }
});

module.exports = router;