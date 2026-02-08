import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../api/auth/authApi.index";
import { useAuthStore } from "../stores/authStore";

export function useLogout() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearUser();
      navigate("/login");
    }
  };

  return { logout };
}
