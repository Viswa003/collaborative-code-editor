// client/src/components/RoomCreationForm.js
import React, { useState } from 'react';

const RoomCreationForm = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send room creation request to the server
    // Implement this part later
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Room Name:
        <input type="text" value={roomName} onChange={handleRoomNameChange} />
      </label>
      <button type="submit">Create Room</button>
    </form>
  );
};

export default RoomCreationForm;
