import styled from "styled-components";

import type { SessionDetail } from "../../types/api/searchSession";

export default function ParticipantSection({
  session,
}: {
  session: SessionDetail;
}) {
  const MAX_VISIBLE = 5;
  const totalCount = session.participants.length;
  const visibleParticipants = session.participants.slice(0, MAX_VISIBLE);
  const remainingCount = Math.max(0, totalCount - MAX_VISIBLE);

  return (
    <Container>
      <SectionTitle>
        참여자 <span className="count">({totalCount}명)</span>
      </SectionTitle>
      <ParticipantList>
        {visibleParticipants.map((name, idx) => (
          <Bubble key={idx} color={idx % 2 === 0 ? "#A685FA" : "#FF85C0"}>
            {name[0]}
          </Bubble>
        ))}
        {remainingCount > 0 && (
          <Bubble className="more">+{remainingCount}</Bubble>
        )}
      </ParticipantList>
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

  .count {
    font-weight: 400;
    color: var(--color-gray-600);
    margin-left: 4px;
  }
`;

const ParticipantList = styled.div`
  display: flex;
  gap: -8px;
`;

const Bubble = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "var(--color-gray-200)"};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid white;
  margin-right: -8px;

  &.more {
    background-color: var(--color-gray-100);
    color: var(--color-gray-600);
    font-size: 12px;
  }
`;
