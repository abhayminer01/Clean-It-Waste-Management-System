// auth-api.js
import axios from 'axios';
const BASE_URL = "http://localhost:5000/api"

export const userLogin = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/auth/login`, payload, {
            withCredentials : true
        });
        const res = req.data;
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}
