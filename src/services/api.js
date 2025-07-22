import axios from "axios";
import { API_ROOT } from "../utils/constants";

let api = axios.create({
  baseURL: API_ROOT,
  timeout: 1000 * 30,
  // withCredentials: true, // nếu dùng httpOnly cookies
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url.endsWith("/auth/login") ||
      originalRequest.url.endsWith("/auth/refresh")
    ) {
      // Trả về Promise.reject để caller tự xử lý lỗi
      return Promise.reject(error);
    }

    // Trường hợp token hết hạn (401) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        const res = await axios.post(`${API_ROOT}auth/refresh`, { refreshToken });
        const newAccessToken = res.data.result.token;

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu lỗi khác 401 hoặc đã retry rồi mà vẫn lỗi
    return Promise.reject(error);
  }
);

export default api;
