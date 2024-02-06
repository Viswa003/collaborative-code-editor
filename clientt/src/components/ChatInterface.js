// client/src/components/ChatInterface.js
import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (event) => {
    event.preventDefault();
    // Emit a message to the server
    socket.emit('sendMessage', newMessage);

    // Clear the input field after sending the message
    setNewMessage('');
  };

  useEffect(() => {
    // Event listener for incoming messages from the server
    socket.on('receiveMessage', (message) => {
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  return (
    <div>
      <h2>Live Chat</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
