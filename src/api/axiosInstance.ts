import axios from "axios";

const AUTH_ERROR_KEY = "authErrorMessage";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 추후 .env 설정
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message ?? "로그인이 필요합니다.";
      try {
        sessionStorage.setItem(AUTH_ERROR_KEY, message);
      } catch {
        // ignore
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { AUTH_ERROR_KEY };
