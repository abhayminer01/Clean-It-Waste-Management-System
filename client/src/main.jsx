import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import LaunchPage from './pages/launch-page';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <LaunchPage /> } />
        <Route path='home' element = { <HomePage /> } />
        <Route path='login' element = { <LoginPage /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)