import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import LaunchPage from './pages/LaunchPage';
import LoginPage from './pages/LoginPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element = { <LaunchPage /> } />
        <Route path='login' element = { <LoginPage /> } />
      </Routes>
    </Router>
  </StrictMode>
)
