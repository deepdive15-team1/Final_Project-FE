import styled from "styled-components";

import type { SessionDetail } from "../../types/api/searchSession";
import Chip from "../common/chip";

export default function HostSection({ session }: { session: SessionDetail }) {
  return (
    <Container>
      <SectionTitle>호스트</SectionTitle>
      <HostCard>
        <ProfileCircle>{session.hostName[0]}</ProfileCircle>
        <HostInfo>
          <div className="name">{session.hostName}</div>
          <Chip
            label={`매너온도 ${session.hostMannerTemp}°C`}
            size="small"
            color="green"
            variant="filled"
          />
        </HostInfo>
      </HostCard>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text);
`;

const HostCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
`;

const HostInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .name {
    font-weight: 600;
    font-size: 15px;
    color: var(--color-text);
  }
`;
