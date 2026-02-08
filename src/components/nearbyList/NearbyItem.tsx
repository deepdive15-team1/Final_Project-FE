import styled from "styled-components";

import ClockIcon from "../../assets/icon/clock.svg?react";
import FlickerIcon from "../../assets/icon/flicker.svg?react";
import MarkerIcon from "../../assets/icon/mark.svg?react";
import PathIcon from "../../assets/icon/path.svg?react";
import type { NearbyItemProps } from "../../types/models/nearbySession";
import { formatStartAt, secondsToPaceString } from "../../utils/pace";
import { CardBase } from "../common/cardbase/CardBase";
import Chip from "../common/chip";

export default function NearbyItem({ session, onClick }: NearbyItemProps) {
  const {
    id,
    title,
    applicants,
    maxCapacity,
    locationName,
    distanceFromPositionKm,
    targetDistanceKm,
    avgPaceSec,
    startAt,
  } = session;

  const distanceStr =
    distanceFromPositionKm >= 1
      ? `${distanceFromPositionKm.toFixed(1)}km`
      : `${(distanceFromPositionKm * 1000).toFixed(0)}m`;

  return (
    <CardBase key={id} as="button" type="button" onClick={onClick}>
      <TopSection>
        <Title>{title}</Title>
        <Chip
          label={`${applicants}/${maxCapacity}명 모집중`}
          color="primary"
          variant="filled"
          size="small"
        />
      </TopSection>

      <LocationSection>
        <MarkerIcon />
        <LocationText>
          {locationName} ㆍ {distanceStr} 거리
        </LocationText>
      </LocationSection>

      <MetricsSection>
        <Metric>
          <PathIcon />
          <span>{targetDistanceKm}km</span>
        </Metric>
        <MetricDivider />
        <Metric>
          <FlickerIcon />
          <span>{secondsToPaceString(avgPaceSec)}</span>
          <span>/km</span>
        </Metric>
        <MetricDivider />
        <Metric>
          <ClockIcon />
          <span>{formatStartAt(startAt)}</span>
        </Metric>
      </MetricsSection>
    </CardBase>
  );
}

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  flex: 1;
  text-align: left;
`;

const LocationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;

  svg {
    flex-shrink: 0;
  }
`;

const LocationText = styled.span`
  font-size: 13px;
  color: var(--color-gray-600);
`;

const MetricsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text);

  svg {
    flex-shrink: 0;
  }
`;

const MetricDivider = styled.span`
  width: 1px;
  height: 12px;
  background-color: var(--color-gray-200);
`;
