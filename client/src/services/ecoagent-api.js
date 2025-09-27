import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

export const agentLogin = async (payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/ecoagent/login`,payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching pickups" };
  }
};
