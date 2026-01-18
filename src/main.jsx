/* Rationale:
Application entry point for Cryptico cryptocurrency trading platform.
We register Firebase service worker for push notifications and wrap app with necessary providers. */

import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);

// Because traders need instant notifications for trade updates, we register Firebase service worker for background messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Firebase Service Worker registered:', registration);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}
