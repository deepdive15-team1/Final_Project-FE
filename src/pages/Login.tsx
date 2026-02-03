import { Link } from "react-router-dom";
import styled from "styled-components";

import LockIcon from "../assets/icon/lock.svg?react";
import UserIcon from "../assets/icon/my.svg?react";
import LogoIcon from "../assets/logo.svg?react";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import { Input } from "../components/common/input/Input";

export default function Login() {
  const pageHeader = <Header title="로그인" />;
  const userIcon = <UserIcon style={{ color: "var(--color-gray-600)" }} />;
  const lockIcon = <LockIcon style={{ color: "var(--color-gray-600)" }} />;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("submit");
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
          // onChange={(e) => console.log(e.target.value)}
        />
        <Input
          type="password"
          label="비밀번호"
          startIcon={lockIcon}
          placeholder="비밀번호를 입력해주세요"
          name="password"
          // onChange={(e) => console.log(e.target.value)}
        />

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

const SubmitBtnWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const LoginLav = styled(Link)`
  color: var(--color-main);
  font-size: inherit;
  font-weight: inherit;
`;
