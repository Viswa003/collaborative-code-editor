// client/src/components/RoomJoin.js
import React, { useState } from 'react';
import socket from '../socket'; // Import the socket instance

const RoomJoin = ({ onRoomJoin }) => {
  const [roomCode, setRoomCode] = useState('');

  const handleJoinRoom = () => {
    // Emit the room code to the server to join the room
    socket.emit('joinRoom', roomCode);

    // Pass the room code to the parent component (App.js)
    onRoomJoin(roomCode);
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <label>
        Room Code:
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
      </label>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default RoomJoin;
