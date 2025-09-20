import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';

export const checkAuth = async () => {
    try {
        const req = await axios.get(`${BASE_URL}/auth/checkauth`, {
            withCredentials : true,
        });
        return req.data;
    } catch (error) {
        console.log(`Error Occured on checkAuth function : ${error}`);
    }
}