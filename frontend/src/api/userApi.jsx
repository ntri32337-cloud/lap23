// src/api/userApi.jsx
import axiosClient from "./axiosClient";

const userApi = {
  getAll: (params = {}) => axiosClient.get("/users", { params }),

  // ✅ Lab22
  getUsersPermission: (params = {}) => axiosClient.get("/users/permissions", { params }),

  create: (data) => axiosClient.post("/users", data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  remove: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;