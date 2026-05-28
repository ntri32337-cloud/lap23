// src/api/employeeApi.jsx
import axiosClient from "./axiosClient";
const employeeApi = {
  getAll: (params = {}) => axiosClient.get("/employees", { params }),
  create: (data) => axiosClient.post("/employees", data),
  update: (id, data) => axiosClient.put(`/employees/${id}`, data),
  remove: (id) => axiosClient.delete(`/employees/${id}`),
};
export default employeeApi;