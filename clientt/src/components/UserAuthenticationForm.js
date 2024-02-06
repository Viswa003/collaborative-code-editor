// client/src/components/UserAuthenticationForm.js
import './UserAuthenticationForm.css';
import React, { useState } from 'react';

const UserAuthenticationForm = ({ onAuthenticate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulate successful authentication
      const authToken = 'temporaryAuthToken';

      // Store the token in localStorage
      localStorage.setItem('authToken', authToken);

      // Continue with the rest of your logic
      onAuthenticate({ username: 'testUser' });
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default UserAuthenticationForm;
