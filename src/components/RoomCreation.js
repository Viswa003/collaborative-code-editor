import React, { useState, useCallback, useEffect } from 'react';
import socket from '../socket';

const RoomCreation = ({ onRoomCreation }) => {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = useCallback((e) => {
    e.preventDefault();
    socket.emit('createRoom', roomName); // Only send room name
  }, [roomName]);

  useEffect(() => {
    const handleRoomCreated = (roomCode) => {
      onRoomCreation(roomCode);
    };

    socket.on('roomCreated', handleRoomCreated);

    return () => {
      socket.off('roomCreated', handleRoomCreated);
    };
  }, [onRoomCreation]);

  return (
    <div className="create-room">
      <h2>Create a Room</h2>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default RoomCreation;
