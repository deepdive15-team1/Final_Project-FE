import styled from "styled-components";

import type { UserInfoResponse } from "../../types/api/myPage";

interface UserStatsProps {
  data: UserInfoResponse;
}

export default function UserStats({ data }: UserStatsProps) {
  return (
    <StatsGrid>
      <StatBox>
        <StatLabel>주간 러닝</StatLabel>
        <StatValue>평균 {data.weeklyRuns}회</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>평균 페이스</StatLabel>
        <StatValue>{data.avgPaceMinPerKm} min/km</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>총 러닝</StatLabel>
        <StatValue>{data.totalRuns}회</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>누적 거리</StatLabel>
        <StatValue>{data.totalDistanceKm}km</StatValue>
      </StatBox>
    </StatsGrid>
  );
}

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatBox = styled.div`
  background-color: var(--color-gray-100);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: var(--color-gray-600);
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
`;
