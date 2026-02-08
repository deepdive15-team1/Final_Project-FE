import styled from "styled-components";

import Check from "../../assets/icon/check.svg";
import { Button } from "../common/button/Button";

import { ItemCard, ItemContent, RunMeta, RunTitle } from "./styles";

interface HistoryRunItemProps {
  date: string;
  title: string;
  isCompleted: boolean;
}

export default function HistoryRunItem({
  date,
  title,
  isCompleted,
}: HistoryRunItemProps) {
  const displayDate = date.slice(5).replace("-", ".");

  return (
    <ItemCard>
      <DateBox>{displayDate}</DateBox>
      <ItemContent>
        <RunTitle>{title}</RunTitle>
        {isCompleted && (
          <RunMeta className="completed">
            <img
              style={{ color: "var(--color-green)", marginRight: 4 }}
              src={Check}
            />{" "}
            완료
          </RunMeta>
        )}
      </ItemContent>
      <Button
        variant="outlinePrimary"
        size="sm"
        style={{ width: "fit-content", fontSize: "12px", padding: "0 12px" }}
      >
        평가하기
      </Button>
    </ItemCard>
  );
}

const DateBox = styled.div`
  background-color: var(--color-main-light);
  color: var(--color-main);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  margin-right: 16px;
  flex-shrink: 0;
`;
