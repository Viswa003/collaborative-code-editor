import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserAuthenticationForm from './components/UserAuthenticationForm';
import RoomOptions from './components/RoomOptions';
import RoomSection from './components/RoomSection';
import socket from './socket';
import './App.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/checkAuth', { credentials: 'include' });
        const data = await response.json();
        setAuthenticated(data.authenticated);
        if (data.authenticated && data.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleAuthenticate = ({ username }) => {
    setAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      setAuthenticated(false);
      setUsername('');
      socket.disconnect();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            authenticated ? (
              <Navigate to="/rooms" />
            ) : (
              <UserAuthenticationForm onAuthenticate={handleAuthenticate} />
            )
          } />
          <Route path="/rooms" element={
            authenticated ? (
              <RoomOptions username={username} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/room/:roomId" element={
            authenticated ? (
              <RoomSection username={username} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;