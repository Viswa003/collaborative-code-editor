import React, { useEffect, useState, useCallback } from 'react';
import socket from '../socket';

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('');

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    socket.emit('codeChange', roomId, newCode);
  }, [roomId]);

  useEffect(() => {
    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('codeChange');
    };
  }, [roomId]);

  return (
    <textarea value={code} onChange={(e) => handleCodeChange(e.target.value)} />
  );
};

const Chat = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit('sendMessage', roomId, 'username', message); // Replace 'username' with actual username
    setMessage('');
  };

  useEffect(() => {
    socket.on('chatMessage', (username, message) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [roomId]);

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}><b>{msg.username}</b>: {msg.message}</li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export { CodeEditor, Chat };
