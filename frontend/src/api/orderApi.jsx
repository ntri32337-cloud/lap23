// src/api/orderApi.js
import axios from "axios";

// 🔥 BASE URL
const API_BASE_URL = "http://localhost:5000/api";

// ✅ Axios instance
const orderApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🛒 CREATE ORDER
export const createOrder = async (orderData) => {
  console.log("🚀 GỬI ORDER →", `${API_BASE_URL}/orders`);
  console.log("📦 DATA:", orderData);

  try {
    const response = await orderApi.post("/orders", orderData);
    console.log("✅ RESPONSE:", response.data);
    return response;
  } catch (error) {
    console.error("❌ ORDER API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// 📋 GET ALL ORDERS (Dashboard)
export const getOrders = async () => {
  try {
    const response = await orderApi.get("/orders");
    return response.data;
  } catch (error) {
    console.error("❌ GET ORDERS ERROR:", error);
    throw error;
  }
};
  

// 🔄 UPDATE STATUS
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await orderApi.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("❌ UPDATE STATUS ERROR:", error);
    throw error;
  }
};


export default orderApi;