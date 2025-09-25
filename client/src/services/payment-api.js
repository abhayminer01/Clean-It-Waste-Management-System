import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// CREATE PAYMENT
export const createPaymentIntent = async (payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/payment/create-intent`, payload, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error creating payment intent" };
  }
};

// CONFIRM PAYMENT (OPTIONAL)
export const confirmPayment = async (paymentId, payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/payment/${paymentId}/confirm`, payload, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error confirming payment" };
  }
};

// GET PAYMENT HISTORY OF USER
export const getUserPayments = async () => {
  try {
    const req = await axios.get(`${BASE_URL}/payment/user`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching payments" };
  }
};

// GET PAYMENT BY ID
export const getPaymentById = async (id) => {
  try {
    const req = await axios.get(`${BASE_URL}/payment/${id}`, {
      withCredentials: true,
    });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching payment" };
  }
};
