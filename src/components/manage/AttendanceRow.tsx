import styled from "styled-components";

import type { AttendanceMember } from "../../types/api/manage";
import { Button } from "../common/button/Button";

interface AttendanceRowProps {
  member: AttendanceMember;
  onUpdate: (id: number, status: "ATTENDED" | "ABSENT") => void;
}

export default function AttendanceRow({
  member,
  onUpdate,
}: AttendanceRowProps) {
  const isAttended = member.attendanceStatus === "ATTENDED";

  return (
    <Wrapper>
      <ProfileArea>
        <Avatar>{member.userName[0]}</Avatar>
        <Name>{member.userName}</Name>
      </ProfileArea>

      <Button
        size="sm"
        rounded
        variant={isAttended ? "primary" : "outline"} // 출석 시 파란색, 아니면 흰색
        onClick={() => onUpdate(member.id, isAttended ? "ABSENT" : "ATTENDED")}
        style={{ width: "80px" }}
      >
        {isAttended ? "출석" : "미출석"}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-gray-100);
  &:last-child {
    border-bottom: none;
  }
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #555;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.span`
  font-size: 16px;
  color: var(--color-black);
  font-weight: 500;
`;
