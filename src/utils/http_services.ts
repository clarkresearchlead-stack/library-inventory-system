import axios from "axios";
import STORAGE_NAMES from "./storage_name";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_NAMES.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_NAMES.TOKEN);
      localStorage.removeItem(STORAGE_NAMES.USER);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default http;