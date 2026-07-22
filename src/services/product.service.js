import api from "@/api/axios";

export const getProducts = (includeInactive = false) => {
  return api.get(`/products${includeInactive ? "?includeInactive=true" : ""}`);
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const restoreProduct = (id) => {
  return api.put(`/products/${id}/restore`);
};
