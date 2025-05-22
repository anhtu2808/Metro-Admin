import axios from "../services/api";

const postLogin = (email, password) => {
  return axios.post("/auth/login", { email, password });
};

export { postLogin };
