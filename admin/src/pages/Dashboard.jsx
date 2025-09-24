import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Dashboard</h1>
      <div className='flex gap-5 ml-10 mt-10'>
        <div onClick={() => navigate('/industry/new')} className='bg-green-500 py-10 px-5 rounded-2xl hover:bg-green-600'>New Industrial Users</div>
        <div className='bg-green-500 py-10 px-5 rounded-2xl hover:bg-green-600'>Manage Industrial Users</div>
      </div>
    </div>
  )
}
