import api from "@/api/axios";

export const getUsers = (includeInactive = false) => {
  return api.get(`/users${includeInactive ? "?includeInactive=true" : ""}`);
};

export const approveUser = (id) => {
  return api.put(`/users/${id}/approve`);
};

export const rejectUser = (id) => {
  return api.delete(`/users/${id}`);
};

export const restoreUser = (id) => {
  return api.put(`/users/${id}/restore`);
};
