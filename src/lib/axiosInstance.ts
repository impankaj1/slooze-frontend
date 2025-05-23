import {
  accessToken,
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/helpers";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshingToken = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config: any) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status !== 401 || originalRequest.retry) {
      return Promise.reject(error);
    }

    if (isRefreshingToken) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      })
        .then(() => {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest.retry = true;
    isRefreshingToken = true;

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.token;

      setAccessToken(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return axiosInstance(originalRequest);
    } catch (error) {
      processQueue(error, null);
      removeAccessToken();
      window.location.href = "/auth/login";
      return Promise.reject(error);
    } finally {
      isRefreshingToken = false;
    }
  }
);
export default axiosInstance;
