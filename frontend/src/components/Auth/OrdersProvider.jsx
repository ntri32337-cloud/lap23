// src/components/Auth/OrdersProvider.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {

  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  const userId = localStorage.getItem("userId");

  // ================= ADMIN ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://backend-lap23.onrender.com/api/orders");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Load orders error:", error);
    }
  };

  // ================= USER ORDERS =================
  const fetchUserOrders = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `https://backend-lap23.onrender.com/api/orders/user/${userId}`
      );

      setUserOrders(res.data.data || []);
    } catch (error) {
      console.error("Load user orders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUserOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `https://backend-lap23.onrender.com/api/orders/${orderId}/status`,
        { status }
      );

      fetchOrders();
      fetchUserOrders();

    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // ================= DELETE =================
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `https://backend-lap23.onrender.com/api/orders/${orderId}`
      );

      fetchOrders();
      fetchUserOrders();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= CANCEL / UNDO =================
  const toggleCancelOrder = async (orderId) => {

    const order = userOrders.find(o => o._id === orderId);
    if (!order) return;

    const newStatus =
      order.status === "cancelled"
        ? "processing"
        : "cancelled";

    try {

      await axios.put(
        `https://backend-lap23.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus }
      );

      fetchUserOrders();

    } catch (error) {
      console.error("Cancel order error:", error);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        userOrders,
        updateOrderStatus,
        deleteOrder,
        toggleCancelOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext); 