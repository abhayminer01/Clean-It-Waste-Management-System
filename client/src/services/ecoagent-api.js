import axios from 'axios';
const BASE_URL = import.meta.env.BACKEND_BASE_URL;

export const agentLogin = async (payload) => {
  try {
    const req = await axios.post(`${BASE_URL}/ecoagent/login`,payload, { withCredentials: true });
    return req.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching pickups" };
  }
};



export const getNewHouseholdPickups = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/ecoagent/pickups/new/household`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching household pickups" };
  }
};

export const getNewIndustrialPickups = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/ecoagent/pickups/new/industrial`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Error fetching industrial pickups" };
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


export const getPickupDetails = async (pickupId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/pickup/${pickupId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "Error updating pickup" };
  }
}

export const submitRating = async (ratingId, scores) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/rating/${ratingId}`,
      scores,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "Error updating pickup" };
  }
}


export const getAgentProfile = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/ecoagent/profile`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "Error Getting profile" };
  }
}

export const logoutAgent = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/ecoagent/logout`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "Error Getting profile" };
  }
}