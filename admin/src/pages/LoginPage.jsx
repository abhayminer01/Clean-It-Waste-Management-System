import React from 'react'

export default function LoginPage() {
    const handleForm = async(e) => {
        const payload = {
            email : e.target.email.value,
            password : e.target.password.value,
        };
        
    }
  return (
    <div>
        <form onSubmit={handleForm}>
            <h1>Admin login</h1>
            <div>
                <label>Email :</label>
                <input type="email" name='email'/>
            </div>
            <div>
                <label>Password :</label>
                <input type="password" name='password'/>
            </div>
            <input type="submit" />
        </form>
    </div>
  )
}
