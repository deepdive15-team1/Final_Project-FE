import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { signup } from "../api/auth/authApi.index";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import { Input } from "../components/common/input/Input";
import { Select } from "../components/common/select";
import type { AgeGroup, Gender } from "../types";
import { formatPaceDisplay, paceStringToSeconds } from "../utils/pace";
import {
  isEmpty,
  areEqual,
  isInRange1To7,
  isValidPassword,
} from "../utils/validation";

function validateSignupForm(fd: FormData): Record<string, string> {
  const next: Record<string, string> = {};
  const username = fd.get("username");
  const password = fd.get("password");
  const passwordConfirm = fd.get("passwordConfirm");
  const name = fd.get("name");
  const ageGroup = fd.get("ageGroup");
  const gender = fd.get("gender");
  const weeklyRuns = fd.get("weeklyRuns");
  const avgPaceMinPerKm = fd.get("avgPaceMinPerKm");

  if (isEmpty(username)) next.username = "아이디를 입력해주세요.";
  if (isEmpty(password)) next.password = "비밀번호를 입력해주세요.";
  else if (!isValidPassword(String(password), 8)) {
    next.password =
      "비밀번호는 영문, 숫자 포함 8자 이상이어야 합니다. (특수문자 가능)";
  }
  if (isEmpty(passwordConfirm)) {
    next.passwordConfirm = "비밀번호를 입력해주세요.";
  } else if (!isValidPassword(String(passwordConfirm), 8)) {
    next.passwordConfirm = "비밀번호는 영문, 숫자 포함 8자 이상이어야 합니다.";
  } else if (!areEqual(password, passwordConfirm)) {
    next.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }
  if (isEmpty(name)) next.name = "이름을 입력해주세요.";
  if (isEmpty(ageGroup)) next.ageGroup = "연령대를 선택해주세요.";
  if (isEmpty(gender)) next.gender = "성별을 선택해주세요.";
  if (isEmpty(weeklyRuns)) {
    next.weeklyRuns = "일주일 러닝 횟수를 입력해주세요.";
  } else if (!isInRange1To7(weeklyRuns)) {
    next.weeklyRuns = "1~7 사이 숫자를 입력해주세요.";
  }
  if (isEmpty(avgPaceMinPerKm)) {
    next.avgPaceMinPerKm = "평균 페이스를 입력해주세요.";
  } else if (paceStringToSeconds(String(avgPaceMinPerKm).trim()) === null) {
    next.avgPaceMinPerKm = "mm:ss 형식으로 입력해주세요. (예: 05:30)";
  }

  return next;
}

export default function Signup() {
  const navigate = useNavigate();
  const pageHeader = <Header title="회원가입" />;

  const [paceDisplay, setPaceDisplay] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = validateSignupForm(fd);
    setError(next);
    if (Object.keys(next).length > 0) return;

    const paceStr = String(fd.get("avgPaceMinPerKm") ?? "").trim();
    const avgPaceSeconds = paceStringToSeconds(paceStr);
    if (avgPaceSeconds === null) return;

    const requestBody = {
      username: String(fd.get("username")),
      password: String(fd.get("password")),
      name: String(fd.get("name")),
      ageGroup: String(fd.get("ageGroup")) as AgeGroup,
      gender: String(fd.get("gender")) as Gender,
      weeklyRuns: Number(fd.get("weeklyRuns")),
      avgPaceMinPerKm: avgPaceSeconds,
    };

    try {
      // console.log("[회원가입] 요청:", requestBody);
      await signup(requestBody);
      navigate("/login");
    } catch (err) {
      // console.log("[회원가입] 에러:", err);
      const message =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError((prev) => ({ ...prev, form: message }));
    }
  };

  return (
    <Layout header={pageHeader}>
      <FormWrapper onSubmit={handleSubmit}>
        <Input
          type="text"
          label="아이디"
          placeholder="아이디를 입력해주세요"
          name="username"
          errorMessage={error.username}
        />
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          errorMessage={error.password}
        />
        <Input
          type="password"
          label="비밀번호 확인(영문·숫자 포함 8자 이상)"
          placeholder="비밀번호를 입력해주세요"
          name="passwordConfirm"
          errorMessage={error.passwordConfirm}
        />
        <Input
          type="text"
          label="이름"
          placeholder="아이디와 비밀번호를 찾을 때 사용합니다."
          name="name"
          errorMessage={error.name}
        />
        <Select
          label="나이"
          placeholder="연령대를 선택해주세요"
          name="ageGroup"
          error={!!error.ageGroup}
          helperText={error.ageGroup}
          options={[
            { value: "10S", label: "10대" },
            { value: "20S", label: "20대" },
            { value: "30S", label: "30대" },
            { value: "40S", label: "40대" },
            { value: "50S", label: "50대" },
            { value: "60S", label: "60대 이상" },
          ]}
        />
        <Select
          label="성별"
          placeholder="성별를 선택해주세요"
          name="gender"
          error={!!error.gender}
          helperText={error.gender}
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
          errorMessage={error.weeklyRuns}
        />
        <Input
          type="text"
          label="평균 페이스"
          placeholder="ex) 05:30km/h"
          name="avgPaceMinPerKm"
          value={paceDisplay}
          onChange={(e) => setPaceDisplay(formatPaceDisplay(e.target.value))}
          errorMessage={error.avgPaceMinPerKm}
        />
        {error.form && <FormError>{error.form}</FormError>}
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

const FormError = styled.p`
  width: 100%;
  font-size: 14px;
  color: var(--color-error, #ff4d4f);
  margin: 0;
`;

const SubmitBtnWrapper = styled.div`
  width: 100%;
`;

const LoginLav = styled(Link)`
  color: var(--color-main);
  font-size: inherit;
  font-weight: inherit;
`;
