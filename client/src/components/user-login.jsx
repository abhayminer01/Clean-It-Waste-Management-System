import React from 'react'

export default function UserLogin({ handleClick, handleRegisterClick }) {
  return (
    <div onClick={handleClick} className='flex justify-center bg-black/20 w-screen h-screen absolute'>
        <div onClick={e => e.stopPropagation()} className='absolute bg-green-300 w-[25%] h-[250px]'>
            <h1>Login Page</h1>
            <div>
                <label>Email Id : </label>
                <input type="text" />
            </div>
            <div>
                <label>Password : </label>
                <input type="password" />
            </div>
            <input type="submit" value="Login"/>
            <p>Don't have an account? <a onClick={handleRegisterClick}>Register</a></p>
        </div>
    </div>
  )
}
