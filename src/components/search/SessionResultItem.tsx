import styled from "styled-components";

import type { SessionSummary } from "../../types/api/searchSession";
import { secondsToPaceString } from "../../utils/pace";
import { Button } from "../common/button/Button";
import { CardBase } from "../common/cardbase/CardBase";
import Chip from "../common/chip";

interface Props {
  data: SessionSummary;
  onClickDetail: (id: number) => void;
}

// 날짜 포맷팅
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "오후" : "오전";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute < 10 ? `0${minute}` : minute;

  return `${month}월 ${day}일 ${ampm} ${formattedHour}:${formattedMinute}`;
};

export default function SessionResultItem({ data, onClickDetail }: Props) {
  return (
    <CardBase>
      {/* 타이틀 영역 */}
      <Header>
        <Title>{data.title}</Title>
      </Header>

      {/* 시간 및 장소 */}
      <SubInfo>
        {formatDateTime(data.startAt)} · {data.locationName}
      </SubInfo>

      {/* 거리 및 페이스 정보 */}
      <StatsRow>
        <DistanceBadge>{data.targetDistanceKm}km</DistanceBadge>
        <PaceText>
          평균 페이스 {secondsToPaceString(data.avgPaceSec)}/km
        </PaceText>
      </StatsRow>

      {/* 태그 영역 (성별, 러닝 타입) */}
      <TagsRow>
        <Chip
          label={
            data.genderPolicy === "MALE_ONLY"
              ? "남성"
              : data.genderPolicy === "FEMALE_ONLY"
                ? "여성"
                : "남녀무관"
          }
          size="small"
          variant="filled"
          color="default"
        />
        <Chip
          label={data.runType}
          size="small"
          variant="filled"
          color="secondary"
        />
      </TagsRow>

      {/* 상세보기 버튼 */}
      <ButtonWrapper>
        <Button size="sm" onClick={() => onClickDetail(data.id)}>
          상세보기
        </Button>
      </ButtonWrapper>
    </CardBase>
  );
}

const Header = styled.div`
  margin-bottom: 4px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
`;

const SubInfo = styled.div`
  font-size: 14px;
  color: var(--color-gray-500);
  margin-bottom: 12px;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const DistanceBadge = styled.span`
  background-color: #e8f0fe;
  color: #1a73e8;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
`;

const PaceText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`;

const TagsRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  margin-top: -10px;
`;
