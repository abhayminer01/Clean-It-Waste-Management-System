import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';

export const adminLogin = async (payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/admin/login`, payload, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const getNewIndustry = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/admin/new-industry`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// ✅ Verify Industry
export const verifyIndustry = async (id) => {
  try {
    const req = await axios.put(
      `${BASE_URL}/admin/industry/${id}/verify`,
      {},
      { withCredentials: true }
    );
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// ✅ Reject Industry
export const rejectIndustry = async (id) => {
  try {
    const req = await axios.put(
      `${BASE_URL}/admin/industry/${id}/reject`,
      {},
      { withCredentials: true }
    );
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const getIndustries = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/admin/industry`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};


// ✅ Get all pickups
export const getAllPickups = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/admin/pickups`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// ✅ Delete a pickup
export const deletePickup = async (id) => {
  try {
    const req = await axios.delete(`${BASE_URL}/admin/pickups/${id}`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// ✅ Get all users
export const getAllUsers = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/admin/users`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// ✅ Delete user
export const deleteUser = async (id) => {
  try {
    const req = await axios.delete(`${BASE_URL}/admin/users/${id}`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// Get single user
export const getUserById = async (id) => {
  try {
    const req = await axios.get(`${BASE_URL}/admin/users/${id}`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// Update user
export const updateUser = async (id, payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/admin/users/${id}`, payload, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};
