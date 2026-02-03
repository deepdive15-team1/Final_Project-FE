import { Link } from "react-router-dom";
import styled from "styled-components";

import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import { Input } from "../components/common/input/Input";
import { Select } from "../components/common/select";

export default function Signup() {
  const pageHeader = <Header title="회원가입" />;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("submit");
  };

  return (
    <Layout header={pageHeader}>
      <FormWrapper onSubmit={handleSubmit}>
        <Input
          type="text"
          label="아이디"
          placeholder="아이디를 입력해주세요"
          name="username"
          // onChange={(e) => console.log(e.target.value)}
        />
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          // onChange={(e) => console.log(e.target.value)}
        />
        <Input
          type="password"
          label="비밀번호(영문, 숫자, 조합 8자 이상)"
          placeholder="비밀번호를 입력해주세요"
          name="passwordConfirm"
          // onChange={(e) => console.log(e.target.value)}
        />
        <Input
          type="text"
          label="이름"
          placeholder="아이디와 비밀번호를 찾을 때 사용합니다."
          name="name"
          // onChange={(e) => console.log(e.target.value)}
        />
        <Select
          label="나이"
          placeholder="연령대를 선택해주세요"
          name="ageGroup"
          // value={"나이"}
          // onChange={(e) => setAge(e.target.value)}
          options={[
            { value: "10S", label: "10대" },
            { value: "20S", label: "20대" },
            { value: "30S", label: "30대" },
            { value: "40S", label: "40대" },
            { value: "50S", label: "50대" },
          ]}
        />
        <Select
          label="성별"
          placeholder="성별를 선택해주세요"
          name="gender"
          // value={age}
          // onChange={(e) => setAge(e.target.value)}
          options={[
            { value: "MALE", label: "남성" },
            { value: "FEMALE", label: "여성" },
          ]}
        />
        <Input
          type="number"
          label="일주일 러닝 횟수"
          placeholder="숫자만 입력해주세요(1~7 사이 숫자)"
          name="weeklyRuns"
          // onChange={(e) => console.log(e.target.value)}
        />
        <Input
          type="text"
          label="평균 페이스"
          placeholder="ex) 5:30km/h"
          name="avgPaceMinPerKm"
          // onChange={(e) => console.log(e.target.value)}
        />
        <SubmitBtnWrapper>
          <Button type="submit" variant="primary" size="md" fullWidth>
            가입
          </Button>
        </SubmitBtnWrapper>
      </FormWrapper>

      <LoginLavWrapper>
        <p>이미 계정이 있으신가요?</p>
        <LoginLav to="/login">로그인</LoginLav>
      </LoginLavWrapper>
    </Layout>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  max-width: 360px;
  padding: 24px 18px;
`;

const LoginLavWrapper = styled.div`
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
`;

const LoginLav = styled(Link)`
  color: var(--color-main);
  font-size: inherit;
  font-weight: inherit;
`;
