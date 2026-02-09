import styled from "styled-components";

import type { Participant } from "../../types/api/manage";

interface ConfirmedMemberRowProps {
  data: Participant;
}

export default function ConfirmedMemberRow({ data }: ConfirmedMemberRowProps) {
  if (!data) return null;

  const temp = data.mannerTemp ?? 36.5;
  const isHighTemp = temp >= 37.0;
  const tempColor = isHighTemp ? "var(--color-green)" : "var(--color-gray-600)";
  const tempBg = isHighTemp
    ? "var(--color-green-light)"
    : "var(--color-gray-100)";

  return (
    <RowWrapper>
      <LeftGroup>
        <SmallAvatar>{data.userName.slice(0, 1)}</SmallAvatar>
        <Name>{data.userName}</Name>
      </LeftGroup>

      <TempBadge $color={tempColor} $bg={tempBg}>
        🌡 {temp}°C
      </TempBadge>
    </RowWrapper>
  );
}

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-child {
    border-bottom: none;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SmallAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #a855f7;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
`;

const Name = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
`;

const TempBadge = styled.div<{ $color: string; $bg: string }>`
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
`;
