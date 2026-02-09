import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { login } from "../api/auth/authApi.index";
import { AUTH_ERROR_KEY } from "../api/axiosInstance";
import LockIcon from "../assets/icon/lock.svg?react";
import UserIcon from "../assets/icon/my.svg?react";
import LogoIcon from "../assets/logo.svg?react";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import { Input } from "../components/common/input/Input";
import { useAuthStore } from "../stores/authStore";
import { isEmpty } from "../utils/validation";

function validateLoginForm(fd: FormData): Record<string, string> {
  const next: Record<string, string> = {};
  const username = fd.get("username");
  const password = fd.get("password");

  if (isEmpty(username)) next.username = "아이디를 입력해주세요.";
  if (isEmpty(password)) next.password = "비밀번호를 입력해주세요.";
  return next;
}

/** 401 리다이렉트 시 sessionStorage에 담긴 에러 메시지를 읽고 제거한 뒤 초기 에러 객체 반환 */
function getInitialLoginError(): Record<string, string> {
  try {
    const authError = sessionStorage.getItem(AUTH_ERROR_KEY);
    if (authError) {
      sessionStorage.removeItem(AUTH_ERROR_KEY);
      return { form: authError };
    }
  } catch {
    // ignore
  }
  return {};
}

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const pageHeader = <Header title="로그인" />;
  const userIcon = <UserIcon style={{ color: "var(--color-gray-600)" }} />;
  const lockIcon = <LockIcon style={{ color: "var(--color-gray-600)" }} />;

  // 401 등으로 리다이렉트된 경우 세션 스토리지에 담긴 메시지를 초기값으로 사용
  const [error, setError] =
    useState<Record<string, string>>(getInitialLoginError);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = validateLoginForm(fd);
    setError(next);
    if (Object.keys(next).length > 0) return;

    const requestBody = {
      username: String(fd.get("username")),
      password: String(fd.get("password")),
    };

    try {
      const user = await login(requestBody);
      setUser(user);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError((prev) => ({ ...prev, form: message }));
    }
  };

  return (
    <Layout header={pageHeader}>
      <IconWrapper>
        <LogoIcon />
      </IconWrapper>
      <FormWrapper onSubmit={handleSubmit}>
        <Input
          type="text"
          label="아이디"
          startIcon={userIcon}
          placeholder="아이디를 입력해주세요"
          name="username"
          errorMessage={error.username}
        />
        <Input
          type="password"
          label="비밀번호"
          startIcon={lockIcon}
          placeholder="비밀번호를 입력해주세요"
          name="password"
          errorMessage={error.password}
        />
        {error.form && <FormError>{error.form}</FormError>}
        <SubmitBtnWrapper>
          <Button type="submit" variant="primary" size="md" fullWidth>
            로그인
          </Button>
        </SubmitBtnWrapper>
      </FormWrapper>

      <SignupLavWrapper>
        <p>계정이 없으신가요?</p>
        <LoginLav to="/signup">계정 만들기</LoginLav>
      </SignupLavWrapper>
    </Layout>
  );
}

const IconWrapper = styled.div`
  margin: 80px 0 36px 0;

  svg {
    width: 150px;
    height: 150px;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  max-width: 360px;
  padding: 24px 18px;
`;

const SignupLavWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;

  p {
    color: var(--color-gray-600);
  }
`;

const FormError = styled.p`
  width: 100%;
  font-size: 14px;
  color: var(--color-error, #ff4d4f);
  margin: 0;
`;

const SubmitBtnWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const LoginLav = styled(Link)`
  color: var(--color-main);
  font-size: inherit;
  font-weight: inherit;
`;
