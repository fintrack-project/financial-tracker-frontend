import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container); // Create a root for React 18
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}