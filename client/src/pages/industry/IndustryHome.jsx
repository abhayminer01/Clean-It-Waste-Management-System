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

    </div>
  )
}
