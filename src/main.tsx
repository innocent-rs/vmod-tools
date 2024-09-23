import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

const container = document.getElementById('root');
if(container) {
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<App />);

}
