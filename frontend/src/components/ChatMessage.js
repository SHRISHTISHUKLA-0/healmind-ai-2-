import React from 'react';

const ChatMessage = ({ message, isBot }) => {
    return (
        <div 
            style={{
                display: 'flex',
                justifyContent: isBot ? 'flex-start' : 'flex-end',
                marginBottom: '10px'
            }}
        >
            <div
                style={{
                    maxWidth: '70%',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    backgroundColor: isBot ? '#f0f0f0' : '#007bff',
                    color: isBot ? '#000' : '#fff'
                }}
            >
                {message}
            </div>
        </div>
    );
};

export default ChatMessage;
