import axios from 'axios';
const BASE_URL = "http://localhost:5000/api"

export const userLogin = async (payload) => {
    try {
        const req = axios.post(`${BASE_URL}/auth/login`, {payload}, {
            withCredentials : true
        }).then((e) => {
            console.log(e.data);
        })
    } catch (error) {
        
    }
}