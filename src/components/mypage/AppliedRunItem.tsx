import ChatIcon from "../../assets/icon/chat.svg";
import Clock from "../../assets/icon/clock.svg";
import { Button } from "../common/button/Button";
import Chip from "../common/chip";

import { ItemCard, ItemContent, RunMeta, RunTitle, RightGroup } from "./styles";

interface AppliedRunItemProps {
  title: string;
  date: string;
  time: string;
  approveStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AppliedRunItem({
  title,
  date,
  time,
  approveStatus,
}: AppliedRunItemProps) {
  const isConfirmed = approveStatus === "APPROVED";
  const formattedDate = date.slice(5).replace("-", ".");

  return (
    <ItemCard>
      <ItemContent>
        <RunTitle>{title}</RunTitle>
        <RunMeta>
          <img style={{ marginRight: 4 }} src={Clock} alt="time" />{" "}
          {formattedDate} {time}
        </RunMeta>
      </ItemContent>

      <RightGroup>
        <Chip
          label={isConfirmed ? "참여 확정" : "승인 대기"}
          color={isConfirmed ? "green" : "yellow"}
          variant="filled"
          size="small"
        />

        {/* 확정 시 채팅 버튼 표시 */}
        {isConfirmed && (
          <Button
            size="xs"
            rounded
            iconOnly
            variant="neutral"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 방지
            }}
            // 공통 버튼의 색상을 초록색 테마로 오버라이딩
            style={{
              backgroundColor: "var(--color-green-light)",
              width: "68px",
              height: "28px",
            }}
          >
            <img src={ChatIcon} alt="chat" style={{ width: 16, height: 16 }} />
          </Button>
        )}
      </RightGroup>
    </ItemCard>
  );
}
