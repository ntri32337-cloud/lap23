import axiosClient from "./axiosClient";

const foodApi = {
  getAll: (params = {}) => axiosClient.get("/foods", { params }),
  getById: (id) => axiosClient.get(`/foods/${id}`),
  create: (data) => axiosClient.post("/foods", data),
  update: (id, data) => axiosClient.put(`/foods/${id}`, data),
  remove: (id) => axiosClient.delete(`/foods/${id}`),
};

export default foodApi;