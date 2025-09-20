import React, { useEffect } from 'react'
import { checkAuth } from '../services/auth-api';

export default function LaunchPage() {
    useEffect(() => {
      async function fn() {
        const req = await checkAuth();
        console.log(req);
      }
      fn();
    }, []);
  return (
    <div>
      <h1>Launch Page</h1>
      <button className='bg-green-500 px-3 py-1 rounded-lg text-white hover:bg-green-600'>Login</button>
    </div>
  )
}
