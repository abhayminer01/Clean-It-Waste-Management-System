import React, { useEffect, useState } from 'react'
import { checkAuth, checkStatus } from '../../services/industry-api'
import { useNavigate } from 'react-router-dom';

export default function IndustryHome() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('');

  useEffect(() => {
    async function checkSession() {
      const req = await checkAuth();
      if (!req?.success) {
        navigate('/industry/login');
      }
    }

    async function loadStatus() {
      const req = await checkStatus();
      setStatus(req.status);
    }

    checkSession();
    loadStatus();
  }, []);

  return (
    <div>IndustryHome
      {status === 'pending' && <>
        <h1>You need to wait for the confirmation of admin.</h1>
      </>}

      {
        status === 'verified' && <>
          <div className='flex gap-5'>
            <div onClick={() => navigate('/industry/schedule')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
              Schedule Pickup
            </div>
            <div className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
              Profile
            </div>
            <div onClick={() => navigate('/industry/pickup-history')} className='bg-green-500 px-10 py-10 rounded-lg hover:bg-green-600'>
              Pickup History
            </div>
          </div>
        </>
      }
    </div>
  )
}
