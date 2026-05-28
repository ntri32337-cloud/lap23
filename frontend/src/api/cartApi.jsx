// src/api/cartApi.jsx
import axiosClient from "./axiosClient";

const cartApi = {
  getCart: (ownerId) => axiosClient.get(`/carts/${ownerId}`),
  addToCart: (data) => axiosClient.post("/carts/add", data),
  updateQuantity: (data) => axiosClient.put("/carts/update", data),
  updateSelected: (data) => axiosClient.put("/carts/updateSelected", data),
  removeItem: (data) => axiosClient.delete("/carts/remove", { data }),
  deleteSelectedCart: (data) =>
  axiosClient.put("/carts/deleteSelectedCart", data),
};

export default cartApi;