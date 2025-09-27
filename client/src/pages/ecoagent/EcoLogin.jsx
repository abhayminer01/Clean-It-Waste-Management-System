import React from 'react'
import { agentLogin } from '../../services/ecoagent-api';
import { useNavigate } from 'react-router-dom';

export default function EcoLogin() {

    const navigate = useNavigate();

    const handleForm = async(e) =>{
        e.preventDefault();
        const id = e.target.id.value;
        const password = e.target.password.value;
        const payload = {
            id : id,
            password : password
        }

        const res = await agentLogin(payload);
        if(res.success) {
            alert('Login Successfull !');
            navigate('/ecoagent/dashboard');
        } else {
            alert(`${res.message || "something happened"}`);
        }
    }
  return (
    <div>
        <form onSubmit={handleForm}>
            <h1>Eco Agent Login</h1>
            <div>
                <label>Id : </label>
                <input name='id' type="text" />
            </div>
            <div>
                <label>Password : </label>
                <input name='password' type="password" />
            </div>
            <input type="submit" />
        </form>
    </div>
  )
}
