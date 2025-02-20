const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateAIResponse = async (message, context = []) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "You are Healmind AI, a compassionate mental health chatbot. Provide supportive, empathetic responses while maintaining appropriate boundaries and suggesting professional help when needed."
                },
                ...context,
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate AI response');
    }
};

module.exports = { openai, generateAIResponse };
