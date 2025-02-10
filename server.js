const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");  // Add body-parser to handle JSON in the request body
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();  // Initialize app first

app.use(cors());  // Then use cors
app.use(bodyParser.json());  // Parse JSON request bodies

// Use the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);  // Correct way to use environment variables

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    // Get conversation history from the request body
    const conversation = req.body.history || [];

    if (conversation.length === 0) {
        return res.status(400).json({ error: "Conversation history is required." });
    }

    try {
        // Create a structured prompt to send to the AI model
        let prompt = "";
        for (let msg of conversation) {
            prompt += `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}\n`;
        }

        // Generate AI response using the conversation history
        const result = await model.generateContent(prompt);

        // Send the AI-generated response back to the frontend
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ reply: "Erro ao processar a resposta." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando em https://lirabot.onrender.com`));
