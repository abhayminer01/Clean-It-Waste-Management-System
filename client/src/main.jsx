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
import EcoLogin from './pages/ecoagent/EcoLogin';
import Dashboard from './pages/ecoagent/Dashboard';
import NewPickups from './pages/ecoagent/NewPickups';
import PickupDetails from './pages/ecoagent/PickupDetails';
import EcoPickupHistory from './pages/ecoagent/EcoPickupHistory';
import AcceptedPickups from './pages/ecoagent/AcceptedPickups';
import RatingPage from './pages/ecoagent/RatingPage';
import IndustryProfile from './pages/industry/IndustryProfile';
import AgentProfile from './pages/ecoagent/AgentProfile';
import EcoCoin from './pages/household/EcoCoin';

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
        <Route path='industry/profile' element = { <IndustryProfile /> } />

        <Route path='schedule' element = { <Schedule /> } />
        <Route path='pickup/history' element = { <PickupHistory /> } />

        <Route path='ecoagent/login' element = { <EcoLogin /> } />
        <Route path='ecoagent/dashboard' element = { <Dashboard /> } />
        <Route path='ecoagent/pickups/new' element = { <NewPickups /> } />
        <Route path='ecoagent/pickups/:id' element = { <PickupDetails /> } />
        <Route path='ecoagent/pickups/history' element = { <EcoPickupHistory /> } />
        <Route path='ecoagent/pickups/accepted' element = { <AcceptedPickups /> } />
        <Route path='ecoagent/rating/:id' element = { <RatingPage /> } />
        <Route path='ecoagent/profile' element = { <AgentProfile /> } />

        <Route path='ecocoins' element = { <EcoCoin /> } />


      </Routes>
    </Router>
  </StrictMode>
)
