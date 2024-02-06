// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Replace ReactDOM.render with createRoot().render
const root = document.getElementById('root') || document.createElement('div');
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<App />);
