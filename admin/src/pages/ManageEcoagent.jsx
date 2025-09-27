import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ManageEcoagent() {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Manage Eco Agents</h1>
        <div className='flex gap-5'>
            <div onClick={() => navigate('/ecoagent/create')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                Create Eco Agent
            </div>
        </div>
    </div>
  )
}
