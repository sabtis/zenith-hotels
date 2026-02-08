import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Protocolo de Quebra de Cache Nuclear - Registro Dinâmico
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Adiciona um timestamp para forçar o navegador a buscar um novo SW.js
    const swUrl = `/sw.js?t=${Date.now()}`;
    navigator.serviceWorker.register(swUrl)
      .then(reg => console.log('Zenith SW Nucleus Active:', reg.scope))
      .catch(err => console.error('Zenith SW Nucleus Failure:', err));
  });
}
