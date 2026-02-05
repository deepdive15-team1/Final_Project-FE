import styled from "styled-components";

import LogoIcon from "../../../assets/logo.svg?react";
import { useLogout } from "../../../hooks/useLogout";
import { useAuthStore } from "../../../stores/authStore";
import { Button } from "../button/Button";

export default function HomeHeader() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();

  return (
    <Wrapper>
      <LeftSection>
        <LogoIcon />

        <UserGreeting>
          <h2>반갑습니다, {user?.name ?? "회원"}님</h2>
          <p>오늘도 즐겁게 달려봅시다!</p>
        </UserGreeting>
      </LeftSection>

      <RightSection>
        <Button variant="text" size="xs" onClick={logout} fullWidth>
          로그아웃
        </Button>
      </RightSection>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 110px;
  padding: 0 8px;
  border-bottom: 2px solid var(--color-gray-200);
  background-color: var(--color-bg);

  svg {
    width: 60px;
    height: 60px;
  }
`;

const LeftSection = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;

  svg {
    width: 60px;
    height: 60px;
  }
`;

const UserGreeting = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
  padding-left: 8px;

  h2 {
    font-size: 20px;
    margin: 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

const RightSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    cursor: pointer;
    width: 56px;
  }
`;
