import { useState } from "react";
import styled from "styled-components";

import { Button } from "../common/button/Button";
import { Input } from "../common/input/Input";

interface Props {
  onJoin: (message: string) => void;
  isJoining: boolean;
}

export default function JoinFooter({ onJoin, isJoining }: Props) {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    onJoin(message);
  };

  return (
    <Container>
      {/* 호스트에게 한마디 입력창 */}
      <InputWrapper>
        <Input
          variant="neutral"
          placeholder="호스트에게 한마디"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </InputWrapper>

      {/* 참여 신청 버튼 */}
      <Button
        size="lg"
        variant="primary"
        fullWidth
        onClick={handleClick}
        disabled={isJoining} // 로딩 중 클릭 방지
      >
        {isJoining ? "신청 중..." : "참여 신청하기"}
      </Button>
    </Container>
  );
}

const Container = styled.div`
  padding: 12px 16px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-gray-200);

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;
