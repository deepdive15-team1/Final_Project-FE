import styled from "styled-components";

export const CardBase = styled.article`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 120px;
  flex-direction: column;

  background-color: var(--color-white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  align-items: flex-start;

  padding: 16px;
  gap: 12px;
  transition: all 0.2s ease-in-out;

  color: var(--color-text);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.04);

  //모바일 터치 시 발생하는 기본 회색 하이라이트 제거
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    background-color: var(--color-gray-100);
  }
`;
