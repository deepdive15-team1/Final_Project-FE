import { Button } from "../common/button/Button.tsx";

import { ItemCard, ItemContent, RunMeta, RunTitle } from "./styles";

interface CreatedRunItemProps {
  title: string;
  currentParticipants: number;
  capacity: number;
  status: "OPEN" | "CLOSED" | "DONE";
  onClickManage: () => void;
}

export default function CreatedRunItem({
  title,
  currentParticipants,
  capacity,
  status,
  onClickManage,
}: CreatedRunItemProps) {
  const getStatusText = () => {
    if (status === "OPEN") {
      return `모집 중 (${currentParticipants}/${capacity}명)`;
    }
    return `마감 (${currentParticipants}/${capacity}명)`;
  };

  return (
    <ItemCard>
      <ItemContent>
        <RunTitle>{title}</RunTitle>
        <RunMeta className={status === "OPEN" ? "active" : ""}>
          {getStatusText()}
        </RunMeta>
      </ItemContent>
      <Button
        variant="primary"
        size="sm"
        style={{ width: "fit-content", padding: "0 16px" }}
        onClick={onClickManage}
      >
        관리
      </Button>
    </ItemCard>
  );
}
