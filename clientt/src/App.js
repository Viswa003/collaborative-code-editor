// client/src/App.js
import React, { useState } from 'react';
import UserAuthenticationForm from './components/UserAuthenticationForm';
import RoomCreation from './components/RoomCreation';
import RoomJoin from './components/RoomJoin';
import RoomSection from './components/RoomSection';
import CodeEditor from './components/CodeEditor';
import socket from './socket';
import './App.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleAuthenticate = ({ username }) => {
    // Implement your authentication logic (can be server-based or client-based)
    // For simplicity, we're setting authenticated to true here
    setAuthenticated(true);
  };

  const handleRoomCreation = (roomCode) => {
    // Handle room creation logic (if needed)
    setCurrentRoom(roomCode);
  };

  const handleRoomJoin = (roomCode) => {
    // Handle room join logic (if needed)
    setCurrentRoom(roomCode);
  };

  return (
    <div className="App">
      {!authenticated && <UserAuthenticationForm onAuthenticate={handleAuthenticate} />}
  
      {authenticated && !currentRoom && (
        <div>
          <RoomCreation onRoomCreation={handleRoomCreation} />
          <RoomJoin onRoomJoin={handleRoomJoin} />
        </div>
      )}
  
      {authenticated && currentRoom && (
        <div>
          <div className="CodeEditor">
            <CodeEditor />
          </div>
          <div className="RoomSection">
            <RoomSection />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
