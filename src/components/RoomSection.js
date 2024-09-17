import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Participants from './Participants';
import CodeEditor from './CodeEditor';
import ChatInterface from './ChatInterface';
import socket from '../socket';
import './RoomSection.css';

const RoomSection = ({ username, onLogout }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const handleJoinRoom = () => {
      socket.emit('joinRoom', roomId, username);
    };

    const handleInitialRoomData = ({ code: initialCode, messages: initialMessages, language: initialLanguage, participants: initialParticipants }) => {
      setCode(initialCode);
      setMessages(initialMessages);
      setLanguage(initialLanguage);
      setParticipants(initialParticipants); // Set initial participants
    };

    const handleUpdateParticipants = (updatedParticipants) => {
      setParticipants(updatedParticipants); // Update participants list
    };

    const handleChatMessage = (message) => {
      if (typeof message === 'object' && message !== null && message.content) {
        setMessages(prevMessages => [...prevMessages, {
          sender: message.sender || 'Unknown',
          content: message.content
        }]);
      }
    };

    const handleCodeChange = (newCode) => {
      setCode(newCode);
    };

    const handleLanguageChange = (newLanguage) => {
      setLanguage(newLanguage);
    };

    const handleJoinedRoom = (response) => {
      if (!response.success) {
        alert(response.message || 'Failed to join room');
        navigate('/rooms');
      }
    };

    const handleUserJoined = (joinedUsername) => {
      setParticipants(prevParticipants => [...prevParticipants, joinedUsername]);
      const systemMessage = {
        sender: 'System',
        content: `${joinedUsername} has joined the room`
      };
      setMessages(prevMessages => [...prevMessages, systemMessage]);
    };

    const handleUserLeft = (leftUsername) => {
      setParticipants(prevParticipants => 
        prevParticipants.filter(participant => participant !== leftUsername)
      );
      const systemMessage = {
        sender: 'System',
        content: `${leftUsername} has left the room`
      };
      setMessages(prevMessages => [...prevMessages, systemMessage]);
    };

    socket.on('updateParticipants', handleUpdateParticipants);
    socket.on('chatMessage', handleChatMessage);
    socket.on('initialRoomData', handleInitialRoomData);
    socket.on('codeChange', handleCodeChange);
    socket.on('languageChange', handleLanguageChange);
    socket.on('joinedRoom', handleJoinedRoom);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    handleJoinRoom();

    return () => {
      socket.off('updateParticipants', handleUpdateParticipants);
      socket.off('chatMessage', handleChatMessage);
      socket.off('initialRoomData', handleInitialRoomData);
      socket.off('codeChange', handleCodeChange);
      socket.off('languageChange', handleLanguageChange);
      socket.off('joinedRoom', handleJoinedRoom);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.emit('leaveRoom', roomId, username);
    };
  }, [roomId, username, navigate]);

  const handleSendMessage = (message) => {
    const newMessage = { sender: username, content: message };
    socket.emit('sendMessage', roomId, username, message);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('codeChange', roomId, newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    socket.emit('languageChange', roomId, newLanguage);
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', roomId, username);
    navigate('/rooms');
  };

  return (
    <div className="room-section">
      <div className="header">
        <h1>Room: {roomId}</h1>
        <div className="header-buttons">
          <button className="small-button" onClick={handleLeaveRoom}>Leave Room</button>
          <button className="small-button" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="content">
        <div className="left-panel">
          <Participants participants={participants} />
        </div>
        <div className="middle-panel">
          <div className="language-selector">
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
              <option value="c#">C#</option>
              <option value="ruby">Ruby</option>
              <option value="php">PHP</option>
              <option value="swift">Swift</option>
              <option value="go">Go</option>
              <option value="typescript">TypeScript</option>
              <option value="kotlin">Kotlin</option>
              <option value="rust">Rust</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
          <CodeEditor 
            code={code} 
            language={language}
            onCodeChange={handleCodeChange} 
          />
        </div>
        <div className="right-panel">
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default RoomSection;