import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LaunchPage() {
  
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>LaunchPage</h1>
      <button onClick={() => navigate('/login')} className='bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600'>Get Started !</button>
    </div>
  )
}