import axios from "axios";

const API_URL = "/api/orders/";

// Create new order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, orderData, config);

  return response.data;
};

// Get user orders
const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

// Get open orders
const getOpenOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    "http://localhost:5000/api/orders/open",
    config
  );

  return response.data;
};

const cancelOpenOrder = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log("inside cancel order service");

  const response = await axios.post(
    "http://localhost:5000/api/orders/open/cancel",
    id,
    config
  );

  return response.data;
};

// Delete user order
const deleteOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + orderId, config);

  return response.data;
};

const orderService = {
  createOrder,
  getOrders,
  deleteOrder,
  getOpenOrders,
  cancelOpenOrder,
};

export default orderService;
