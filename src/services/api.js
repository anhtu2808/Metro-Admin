import axios from "axios";
import { API_ROOT } from "../utils/constants";

//Khởi tạo đối tuọng Axios (authorizedAxios) với mục đích custom và cấu hình chung cho dự án
let api = axios.create({
  baseURL: API_ROOT,
});
//thời gian chờ tối đa của 1 request để 30s
api.defaults.timeout = 1000 * 30;
//withCredentials: true để gửi cookie trong request lên backend phục vụ cho trường hợp chung ta su dung JWT token theo cơ chế httpOnly
// authorizedAxiosInstance.defaults.withCredentials = true;

//Câu hình interceptors cho Axios
// Add a request interceptor: can thiệp và giữa các request API
api.interceptors.request.use(
  (config) => {
    //Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    console.log("error", error);
    return Promise.reject(error);
  }
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

// Add a response interceptor : can thiệp vào nhung respone API trả về
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Các request sau sẽ chờ token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_ROOT}auth/refresh`, {
          refreshToken,
        });

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
    return Promise.reject(error);
  }
);

export default api;
