import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

// REGISTER INDUSTRIAL USER
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

// LOGIN INDUSTRIAL USER
export const loginIndustry = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/industry/login`, payload, {
            withCredentials : true
        });
        const res = req.data;
        return res;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

// CHECK SESSION
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

// CHECK USER'S VERIFICATION STATUS
export const checkStatus = async () => {
    try {
        const req = await axios.get(`${BASE_URL}/industry/check-status`, {
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

// GET PICKUP SCHEDULED BY LOGGED IN USER
export const getUserPickups = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/industry/user/history`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching pickups" };
  }
};

// UPDATE PICKUP
export const updatePickup = async (id, payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/industry/${id}`, payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error updating pickup" };
  }
};

// DELETE PICKUP
export const deletePickup = async (id) => {
  try {
    const req = await axios.delete(`${BASE_URL}/industry/${id}`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error deleting pickup" };
  }
};