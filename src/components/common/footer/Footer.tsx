import { Link } from "react-router-dom";
import styled from "styled-components";

import ChatIcon from "../../../assets/icon/chat.svg?react";
import HomeIcon from "../../../assets/icon/home.svg?react";
import MyIcon from "../../../assets/icon/my.svg?react";
import SearchIcon from "../../../assets/icon/search.svg?react";

/**
 * 하단 네비게이션 푸터. 홈 / 탐색 / 채팅 / 마이 탭 링크와 현재 탭 강조 표시.
 *
 * @param {string} current - 현재 페이지에 해당하는 탭 식별자. 이 값과 일치하는 탭만 강조 색으로 표시됨.
 *   - "home"    : 홈 탭 강조
 *   - "search" : 탐색 탭 강조
 *   - "chat"   : 채팅 탭 강조
 *   - "mypage" : 마이 탭 강조
 *
 * @example
 * // 홈 페이지에서
 * <Footer current="home" />
 *
 * @example
 * // 탐색 페이지에서
 * <Footer current="search" />
 */
export default function FooterCopy({ current }: { current: string }) {
  return (
    <Wrapper>
      <NavButton to="/" $active={current === "home"}>
        <HomeIcon />
        <Title>홈</Title>
      </NavButton>

      <NavButton to="/" $active={current === "search"}>
        <SearchIcon />
        <Title>탐색</Title>
      </NavButton>

      <NavButton to="/" $active={current === "chat"}>
        <ChatIcon />
        <Title>채팅</Title>
      </NavButton>

      <NavButton to="/" $active={current === "mypage"}>
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
