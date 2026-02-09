import { useState } from "react";
import styled from "styled-components";

import type { EvaluationMember } from "../../types/api/manage";

interface EvaluationCardProps {
  member: EvaluationMember;
}

export default function EvaluationCard({ member }: EvaluationCardProps) {
  const [feedback, setFeedback] = useState<"LIKE" | "DISLIKE" | null>(null);

  return (
    <CardWrapper>
      <Header>
        <Avatar>{member.userName[0]}</Avatar>
        <Info>
          <Name>{member.userName}</Name>
          <Temp>매너온도 {member.mannerTemp}°C</Temp>
        </Info>
      </Header>

      <ButtonGroup>
        <FeedbackButton
          $active={feedback === "DISLIKE"}
          onClick={() => setFeedback("DISLIKE")}
        >
          👎 아쉬워요
        </FeedbackButton>
        <FeedbackButton
          $active={feedback === "LIKE"}
          onClick={() => setFeedback("LIKE")}
        >
          👍 좋아요
        </FeedbackButton>
      </ButtonGroup>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: 700;
  font-size: 16px;
  text-align: left;
`;

const Temp = styled.span`
  font-size: 12px;
  color: var(--color-main);
  background-color: var(--color-main-light);
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const FeedbackButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$active ? "var(--color-main)" : "#ddd")};
  background-color: ${(props) =>
    props.$active ? "var(--color-main-light)" : "white"};
  color: ${(props) => (props.$active ? "var(--color-main)" : "#555")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;
