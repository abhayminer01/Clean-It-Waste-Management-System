import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import LaunchPage from './pages/LaunchPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import Register from './pages/industry/Register';
import IndustryHome from './pages/industry/IndustryHome';
import IndustryLogin from './pages/industry/IndustryLogin';
import Schedule from './pages/household/Schedule';
import PickupHistory from './pages/household/PickupHistory';
import ProfilePage from './pages/household/ProfilePage';
import ScheduleIndustryPickup from './pages/industry/ScheduleIndustryPickup';
import IndustrialPickupHistory from './pages/industry/IndustrialPickupHistory';
import PaymentHistory from './pages/industry/PaymentHistory';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element = { <LaunchPage /> } />
        <Route path='login' element = { <LoginPage /> } />
        <Route path='home' element = { <HomePage /> } />
        <Route path='register' element = { <RegisterPage /> } />
        <Route path='profile' element = { <ProfilePage /> } />

        <Route path='industry/register' element = { <Register /> } />
        <Route path='industry/home' element = { <IndustryHome /> } />
        <Route path='industry/login' element = { <IndustryLogin /> } />
        <Route path='industry/schedule' element = { <ScheduleIndustryPickup /> } />
        <Route path='industry/pickup-history' element = { <IndustrialPickupHistory /> } />
        <Route path='industry/payment-history' element = { <PaymentHistory /> } />

        <Route path='schedule' element = { <Schedule /> } />
        <Route path='pickup/history' element = { <PickupHistory /> } />
      </Routes>
    </Router>
  </StrictMode>
)
