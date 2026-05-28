// src/api/customerApi.jsx
import axiosClient from "./axiosClient";

const customerApi = {
  getAll: () => axiosClient.get("/customers"),
  create: (data) => axiosClient.post("/customers", data),
  update: (id, data) => axiosClient.put(`/customers/${id}`, data),
  remove: (id) => axiosClient.delete(`/customers/${id}`),
};

export default customerApi;