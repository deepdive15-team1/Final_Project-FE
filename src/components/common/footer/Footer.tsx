import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import ChatIcon from "../../../assets/icon/chat.svg?react";
import HomeIcon from "../../../assets/icon/home.svg?react";
import MyIcon from "../../../assets/icon/my.svg?react";
import SearchIcon from "../../../assets/icon/search.svg?react";

/**
 * 하단 네비게이션 푸터. 홈 / 탐색 / 채팅 / 마이 탭 링크를 제공하며,
 * 현재 경로(pathname)와 일치하는 탭만 강조 색으로 표시한다.
 *
 * - pathname이 "/" → 홈 탭 강조
 * - pathname이 "/search" → 탐색 탭 강조
 * - pathname이 "/chat" → 채팅 탭 강조
 * - pathname이 "/my-page" → 마이 탭 강조
 *
 * @example
 * <Footer />
 */
export default function Footer() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Wrapper>
      <NavButton to="/" $active={pathname === "/"}>
        <HomeIcon />
        <Title>홈</Title>
      </NavButton>

      <NavButton to="/search" $active={pathname === "/search"}>
        <SearchIcon />
        <Title>탐색</Title>
      </NavButton>

      <NavButton to="/chat" $active={pathname === "/chat"}>
        <ChatIcon />
        <Title>채팅</Title>
      </NavButton>

      <NavButton to="/my-page" $active={pathname === "/my-page"}>
        <MyIcon />
        <Title>마이</Title>
      </NavButton>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  padding: 0 8px;
  border-top: 2px solid var(--color-gray-200);
  background-color: var(--color-bg);
`;

const NavButton = styled(Link)<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--color-gray-600)"};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.div`
  font-size: 12px;
`;
