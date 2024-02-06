// client/src/components/RoomCreation.js
import React, { useState, useEffect } from 'react';
import './RoomCreation.css';
import socket from '../socket'; // Import the socket instance

const RoomCreation = ({ onRoomCreation }) => {
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    // Event listener for room creation confirmation from the server
    socket.on('roomCreated', (confirmation) => {
      if (confirmation.success) {
        onRoomCreation(roomCode);
      } else {
        console.error(confirmation.message);
      }
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('roomCreated');
    };
  }, [roomCode]);

  const handleCreateRoom = () => {
    // Generate a unique room code (you can implement your own logic)
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    
    // Emit the new room code to the server
    socket.emit('createRoom', newRoomCode);
  };

  const generateRoomCode = () => {
    // Implement your room code generation logic (e.g., random string)
    // For simplicity, we're generating a random string here
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    let result = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  return (
    <div>
      <h2>Create a Room</h2>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreation;
