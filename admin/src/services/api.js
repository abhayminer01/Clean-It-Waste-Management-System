import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';

export const adminLogin = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/admin/login`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}