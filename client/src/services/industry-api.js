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

// GET PAYMENTS OF LOGGED-IN USER
export const getUserPayments = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/payment/user`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching payments" };
  }
};

// DATA FOR GENERATING PAYMENT INVIOCE
export const getInvoiceData = async (paymentId) => {
  try {
    const req = await axios.post(`${BASE_URL}/payment/invoice`, { paymentId }, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching payments" };
  }
};

// PROFILE - GET
export const getIndustryProfile = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/industry/profile`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching profile" };
  }
};

// PROFILE - UPDATE
export const updateIndustryProfile = async (payload) => {
  try {
    const req = await axios.put(`${BASE_URL}/industry/profile`, payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error updating profile" };
  }
};

// PROFILE - DELETE
export const logoutIndustry = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/industry/profile/logout`, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error deleting account" };
  }
};