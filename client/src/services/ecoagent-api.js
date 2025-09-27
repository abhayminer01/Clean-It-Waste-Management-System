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



export const getNewPickups = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/ecoagent/pickups/new`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching pickups" };
  }
};

export const acceptPickup = async (pickupId) => {
  try {
    const res = await axios.patch(`${BASE_URL}/ecoagent/pickups/${pickupId}/accept`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error accepting pickup" };
  }
};

export const getAcceptedPickups = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/ecoagent/pickups/accepted`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return (
      error.response?.data || {
        success: false,
        message: "Error fetching accepted pickups",
      }
    );
  }
};


export const markPickupAsPicked = async (pickupId) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/ecoagent/pickups/${pickupId}/picked`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "Error updating pickup" };
  }
};
