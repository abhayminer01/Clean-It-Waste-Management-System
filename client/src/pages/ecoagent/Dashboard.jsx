import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
  return (
    <div>
        <h1>EcoAgent Dashboard</h1>
        <div className='flex gap-5'>
            <div onClick={() => navigate('/ecoagent/profile')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                profile
            </div>
            <div onClick={() => navigate('/ecoagent/pickups/new')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                New Pickups
            </div>
            <div onClick={() => navigate('/ecoagent/pickups/accepted')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                Accepted Pickups
            </div>
            <div onClick={() => navigate('/ecoagent/pickups/history')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                Pickup History
            </div>
        </div>
    </div>
  )
}
