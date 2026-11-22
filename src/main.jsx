import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

window.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.select-text, input, textarea, [contenteditable="true"]')) {
    window.getSelection()?.removeAllRanges();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
