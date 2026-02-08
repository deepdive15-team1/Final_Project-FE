import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: var(--color-gray-100);
  min-height: 100%;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: -12px;
  padding-left: 4px;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 흰색 배경 카드 (프로필/통계 감싸기용)
export const SectionCard = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

// [공통] 리스트 아이템
export const ItemCard = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const RunTitle = styled.div`
  font-size: 16px;
  text-align: left;
  font-weight: 700;
  color: var(--color-black);
`;

export const RunMeta = styled.div`
  font-size: 13px;
  color: var(--color-gray-600);
  display: flex;
  align-items: center;

  &.active {
    color: var(--color-main);
  }

  &.completed {
    color: var(--color-gray-600);
    font-size: 12px;
  }
`;

export const RightGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
`;
