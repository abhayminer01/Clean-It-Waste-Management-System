import React, { useEffect } from 'react'
import { checkAuth } from '../../services/industry-api'
import { useNavigate } from 'react-router-dom';

export default function IndustryHome() {
    
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const req = await checkAuth();
            if(!req?.success) {
                navigate('/industry/login');
            }
        }

        fetchData();
    }, []);
  return (
    <div>IndustryHome</div>
  )
}
