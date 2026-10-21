import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './theme.jsx';
import { AuthProvider } from './auth.jsx';
import { ToastProvider } from './toast.jsx';
import { APP } from './config.js';
import './base.css';
import './app.css';

document.title = `${APP.name} — ${APP.short}`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultAccent={APP.accent}>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
