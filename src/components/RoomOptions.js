// RoomOptions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
// import './RoomOptions.css';

const RoomOptions = ({ username, onLogout }) => {
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/rooms', { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: roomName }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.status === 'success') {
        navigate(`/room/${data.room.roomId}`);
      } else {
        console.error('Failed to create room:', data.message);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    navigate(`/room/${joinCode}`);
  };

  return (
    <div className="room-options-container">
      <h1>Welcome, {username}!</h1>
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
      <div className="join-room">
        <h2>Join a Room</h2>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Room Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            required
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
      <div className="available-rooms">
        <h2>Available Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId}>
              {room.name} - {room.participants.length} participants
              <button onClick={() => navigate(`/room/${room.roomId}`)}>Join</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default RoomOptions;
              