import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Global styles removed - using Material-UI theme instead

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
