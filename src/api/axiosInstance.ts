import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 추후 .env 설정
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});
