import styled from "styled-components";

import type { Participant } from "../../types/api/manage";
import { Button } from "../common/button/Button";

interface CandidateCardProps {
  data: Participant;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function CandidateCard({
  data,
  onApprove,
  onReject,
}: CandidateCardProps) {
  return (
    <CardWrapper>
      {/* 상단 정보: 아바타 + 텍스트 */}
      <HeaderRow>
        <Avatar>{data.userName.slice(0, 1)}</Avatar>
        <InfoCol>
          <NameRow>
            <Name>{data.userName}</Name>
            <Badge>
              {data.userAgeGroup}·{data.userGender === "MALE" ? "남성" : "여성"}
            </Badge>
          </NameRow>
          <TempBadge>🌡 {data.mannerTemp ?? 36.5}°C</TempBadge>
        </InfoCol>
      </HeaderRow>

      {/* 통계 정보 */}
      <StatsRow>
        <span>주 {data.weeklyRuns ?? 0}회 러닝</span>
        <Divider />
        <span>평균 {data.avgPace ?? "-"}/km</span>
      </StatsRow>

      {/* 메시지 박스 */}
      <MessageBox>{data.messageToHost}</MessageBox>

      {/* 액션 버튼 */}
      <ButtonRow>
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onReject(data.id)}
        >
          ✕ 거절
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onApprove(data.id)}
        >
          ✓ 수락
        </Button>
      </ButtonRow>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
`;

const Badge = styled.span`
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
`;

const TempBadge = styled.div`
  background-color: var(--color-red-light);
  color: var(--color-red);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-black);
  gap: 8px;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--color-gray-200);
`;

const MessageBox = styled.div`
  background-color: var(--color-gray-100);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-gray-600);
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;
