import api from "@/api/axios";

export const login = (payload) => {
  return api.post("/login", payload);
};

export const logout = () => {
  return api.post("/logout");
};

export const me = () => {
  return api.get("/me");
};

export const register = (payload) => {
  return api.post("/register", payload);
};