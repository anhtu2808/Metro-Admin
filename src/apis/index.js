import api from "../services/api";

export const loginAPI = async (username, password) => {
  const res = await api.post("/v1/auth/login", { username, password });
  return res.data;
};

export const getMyInfoAPI = async () => {
  const res = await api.get("/v1/users/my-info");
  return res.data;
};