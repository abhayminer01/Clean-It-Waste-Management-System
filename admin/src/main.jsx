import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import NewIndustry from './pages/NewIndustry';
import ManageIndustry from './pages/ManageIndustry';
import ManagePickups from './pages/ManagePickups';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element = { <LoginPage /> }/>
        <Route path='dashboard' element = { <Dashboard /> } />
        <Route path='industry/new' element = { <NewIndustry /> } />
        <Route path='industry/manage' element = { <ManageIndustry /> } />
        <Route path='pickup/schedules' element = { <ManagePickups /> } />
        <Route path='users/manage' element = { <ManagePickups /> } />
      </Routes>
    </Router>
  </StrictMode>
)
