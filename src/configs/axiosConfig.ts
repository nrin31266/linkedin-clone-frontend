import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      return Promise.reject({
        status, // HTTP status code
        code: data?.code || status, 
        message: data?.message || "An error occurred.", 
        details: data?.details || null, 
      });
    }

    return Promise.reject({ message: "An unknown error occurred." });
  }
);


export default axiosInstance;
