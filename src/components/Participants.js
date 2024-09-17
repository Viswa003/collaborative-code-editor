import React from 'react';
import './Participants.css';

const Participants = ({ participants }) => {
  return (
    <div className="participants">
      <h3>Participants</h3>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </div>
  );
};

export default Participants;