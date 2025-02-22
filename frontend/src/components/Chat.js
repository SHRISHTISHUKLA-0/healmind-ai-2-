import React, { useState } from "react";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const sendMessage = async () => {
        try {
            const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: { text: message }
                })
            });

            const data = await res.json();
            setResponse(data.choices?.[0]?.text || "No response received.");
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error occurred while fetching response.");
        }
    };

    return (
        <div>
            <h2>Chat with Gemini</h2>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            <p>Response: {response}</p>
        </div>
    );
};

export default Chat;