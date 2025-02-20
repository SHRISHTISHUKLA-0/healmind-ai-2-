const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const { generateAIResponse } = require('../config/openai');

// Route to send a message (protected by auth)
router.post('/send', auth, async (req, res) => {
    try {
        const { message } = req.body;
        
        // Get chat history for context
        let chat = await Chat.findOne({ userId: req.user.id });
        const context = chat ? chat.messages.slice(-5).map(msg => ({
            role: msg.isBot ? "assistant" : "user",
            content: msg.text
        })) : [];

        // Get AI response
        const botResponse = await generateAIResponse(message, context);

        // Create new chat if it doesn't exist
        if (!chat) {
            chat = new Chat({ userId: req.user.id, messages: [] });
        }

        // Save messages to database
        chat.messages.push({ text: message, isBot: false });
        chat.messages.push({ text: botResponse, isBot: true });
        await chat.save();

        res.json({ 
            text: botResponse, 
            timestamp: new Date() 
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// Route to get chat history (protected by auth)
router.get('/history', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({ userId: req.user.id });
        res.json(chat ? chat.messages : []);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
