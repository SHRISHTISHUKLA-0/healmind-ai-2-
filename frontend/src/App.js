import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './components/ChatMessage';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/chat/history');
        setMessages(response.data.map(msg => ([
          { text: msg.user, isBot: false },
          { text: msg.bot, isBot: true }
        ])).flat());
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load chat history');
      }
    };
    loadHistory();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      
      // Add user message immediately
      setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
      setInputMessage('');

      // Send to backend
      const response = await axios.post('http://localhost:5500/api/chat/send', {
        message: inputMessage
      });

      // Add bot response
      setMessages(prev => [...prev, { text: response.data.text, isBot: true }]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Healmind AI Chatbot</h1>
      
      {/* Chat container */}
      <div 
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
        {isLoading && <div style={{ textAlign: 'center', color: '#666' }}>AI is thinking...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <button 
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
