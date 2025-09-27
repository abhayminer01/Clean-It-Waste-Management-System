import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';
const FORMSPREE_URL = "https://formspree.io/f/manpnbpn";

// ADMIN LOGIN
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

// GET UNVERIFIED INDUSTRIES
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

// VERIFY INDUSTRY
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

// REJECT INDUSTRY
export const rejectIndustry = async (id, email, industry_name) => { 
  try { 
    const req = await axios.put(`${BASE_URL}/admin/industry/${id}/reject`,
       {}, 
       { withCredentials: true } 
    );
    if(req.data.success) {
      await axios.post(FORMSPREE_URL, {
        name: "Admin Panel",
        email: email,
        message: `Hello ${industry_name},\n\nWe regret to inform you that your industry registration has been rejected.\n\nRegards,\nAdmin Team`,
      });
    }
    return req.data;
  } catch (error) { 
    console.log(error); 
    return error.response?.data; 
  } 
};

// GET ALL INDUSTRIES
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


// GET ALL PICKUPS
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

// DELETE PICKUP
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

// GET ALL USERS
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

// DELETE USER
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

// GET SINGLE USER
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

// UPDATE USER
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

// CREATE ECO AGENT
export const createAgent = async (payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/admin/ecoagent/create`, payload, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};
