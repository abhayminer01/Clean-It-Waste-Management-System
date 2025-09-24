import React, { useEffect } from 'react'
import { checkAuth, checkStatus } from '../../services/industry-api'
import { useNavigate } from 'react-router-dom';

export default function IndustryHome() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const req = await checkAuth();
      if (!req?.success) {
        navigate('/industry/login');
      }
    }

    async function loadStatus() {
      const req = await checkStatus();
      if(req.status === 'unverified') {
        alert('You need to wait until getting verified...Status : pending');
        navigate('/');
      }
    }

    checkSession();
    loadStatus();
  }, [navigate]);

  return (
    <div>IndustryHome</div>
  )
}
