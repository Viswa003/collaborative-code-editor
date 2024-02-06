// client/src/components/RoomSection.js
import React from 'react';
import socket from '../socket';
import ChatInterface from './ChatInterface'; // Import the ChatInterface component
import './RoomSection.css';

const RoomSection = () => {
  const [participants, setParticipants] = React.useState([]);

  React.useEffect(() => {
    // Event listener for room participants changes from the server
    socket.on('updateParticipants', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('updateParticipants');
    };
  }, []);

  return (
    <div className="RoomSection">
      <h2>Room Participants</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
  
      {/* Render the ChatInterface component */}
      <div className="ChatInterface">
        <ChatInterface />
      </div>
    </div>
  );
};

export default RoomSection;
