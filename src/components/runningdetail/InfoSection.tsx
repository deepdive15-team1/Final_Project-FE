import styled from "styled-components";

import type { SessionDetail } from "../../types/api/searchSession";
import { GENDER_LABEL } from "../../types/api/searchSession";
import { secondsToPaceString } from "../../utils/pace";

export default function InfoSection({ session }: { session: SessionDetail }) {
  // 날짜 포맷팅
  const [date, time] = session.startAt.split("T");

  return (
    <Container>
      <Title>{session.title}</Title>
      <SubText>{session.runType} 러닝</SubText>

      <InfoGrid>
        <InfoItem label="일정" value={`${date} ${time.slice(0, 5)}`} />
        <InfoItem label="모임 장소" value={session.locationName} />
        <InfoItem
          label="평균 페이스"
          value={`${secondsToPaceString(session.avgPaceSec)} /km`}
        />
        <InfoItem
          label="참여 성별"
          value={GENDER_LABEL[session.genderPolicy]}
        />
      </InfoGrid>
    </Container>
  );
}

// 내부용 작은 컴포넌트
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </div>
);

const Container = styled.div`
  padding: 24px 20px 0;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
`;

const SubText = styled.p`
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Label = styled.span`
  font-size: 12px;
  color: var(--color-gray-400);
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
`;
