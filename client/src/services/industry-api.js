import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

export const registerIndustry = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/industry/register`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}


export const checkAuth = async () => {
    try {
        const req = await axios.get(`${BASE_URL}/industry/checkauth`, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}