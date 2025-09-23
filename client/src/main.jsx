import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import LaunchPage from './pages/LaunchPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import Register from './pages/industry/Register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element = { <LaunchPage /> } />
        <Route path='login' element = { <LoginPage /> } />
        <Route path='home' element = { <HomePage /> } />
        <Route path='register' element = { <RegisterPage /> } />

        <Route path='industry/register' element = { <Register /> } />
      </Routes>
    </Router>
  </StrictMode>
)
