import React from 'react';

export default function Dashboard() {
  return (
    <div>
        <h1>EcoAgent Dashboard</h1>
        <div className='flex gap-5'>
            <div className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                profile
            </div>
            <div className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                New Pickups
            </div>
            <div className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
                Pickup History
            </div>
        </div>
    </div>
  )
}
