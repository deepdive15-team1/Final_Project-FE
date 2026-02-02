import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import BackIcon from "../../../assets/icon/back.svg?react";

/**
 * 상단 헤더. 뒤로가기 버튼 + 제목 표시.
 *
 * @param {string} title - 헤더에 표시할 제목 - 필수
 *
 * @example
 * <Header title="홈" />
 */
export default function Header({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <BackButton onClick={() => navigate(-1)}>
        <BackIcon />
      </BackButton>

      <Title>{title}</Title>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  border-bottom: 2px solid var(--color-gray-200);
  background-color: var(--color-bg);
  border: 2px solid red;
`;

const BackButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  color: var(----color-gray-600);
  border: 2px solid blue;
`;

const Title = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: var(----color-gray-600);
  border: 2px solid green;
`;
