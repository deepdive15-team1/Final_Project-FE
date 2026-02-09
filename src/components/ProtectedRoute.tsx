import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 로그인된 사용자만 자식 라우트를 렌더링합니다.
 * 비로그인 시 /login으로 리다이렉트합니다.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return <>{children}</>;
}
