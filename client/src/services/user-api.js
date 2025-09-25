import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

// SCHEDULE PICKUPS (HOUSEHOLD)
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

// SCHEDULE PICKUP (INDUSTRY)
export const createIndustryPickup = async (payload) => {
    try {
        const req = await axios.post(`${BASE_URL}/pickup/create-industry`, payload, {
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

// GET USER'S PICKUP
export const getUserPickups = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/pickup`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// DELETE PICKUP
export const deletePickup = async (id) => {
  try {
    const req = await axios.delete(`${BASE_URL}/pickup/${id}`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// UPDATE PICKUP
export const updatePickup = async (id, payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/pickup/${id}`, payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// GET USER PROFILE
export const getProfile = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/user/profile`, { withCredentials: true });
    return req.data;
  } catch (error) {
    return error.response?.data;
  }
};

// UPDATE PROFILE
export const updateProfile = async (payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/user/profile`, payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    return error.response?.data;
  }
};

// CHANGE PASSWORD
export const changePassword = async (payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/user/change-password`, payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    return error.response?.data;
  }
};

// LOGOUT USER
export const logoutUser = async () => {
  try {
    const req = await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
    return req.data;
  } catch (error) {
    return error.response?.data;
  }
};
