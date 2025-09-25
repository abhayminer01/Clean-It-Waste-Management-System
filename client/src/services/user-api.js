import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

export const createPickup = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/pickup/create`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}