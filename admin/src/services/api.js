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
