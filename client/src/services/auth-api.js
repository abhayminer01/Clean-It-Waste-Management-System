// auth-api.js
import axios from 'axios';
const BASE_URL = "http://localhost:5000/api"

export const userLogin = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/auth/login`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}


export const userRegistration = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/auth/register`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}