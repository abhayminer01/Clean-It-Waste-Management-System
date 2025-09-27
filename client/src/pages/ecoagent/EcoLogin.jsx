import React from 'react'

export default function EcoLogin() {
    const handleForm = async(e) =>{
        
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
