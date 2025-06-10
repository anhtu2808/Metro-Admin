import api from "../services/api";

export const loginAPI = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  console.log(">> check res in index.js", res);
  return res.data;
};
