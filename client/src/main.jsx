import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import LaunchPage from './pages/launch-page';
import RegisterPage from './pages/register-page';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <LaunchPage /> } />
        <Route path='home' element = { <HomePage /> } />
        <Route path='login' element = { <LoginPage /> } />
        <Route path='register' element = { <RegisterPage /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)