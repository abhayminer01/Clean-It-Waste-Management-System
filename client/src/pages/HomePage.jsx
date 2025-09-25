import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home Page</h1>
      <div className='flex gap-5'>
        <div onClick={() => navigate('/schedule')} className='bg-green-500 px-5 py-10 rounded-lg hover:bg-green-600 text-white'>
          Schedule Pickup
        </div>
        <div onClick={() => navigate('/pickup/history')} className='bg-green-500 px-5 py-10 rounded-lg hover:bg-green-600 text-white'>
          Pickup History
        </div>
        <div onClick={() => navigate('/profile')} className='bg-green-500 px-5 py-10 rounded-lg hover:bg-green-600 text-white'>
          Profile
        </div>
        <div className='bg-green-500 px-5 py-10 rounded-lg hover:bg-green-600 text-white'>
          Eco Coins
        </div>
      </div>
    </div>
  )
}
