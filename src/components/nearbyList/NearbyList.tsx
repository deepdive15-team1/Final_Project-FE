import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { nearbySession } from "../../api/nearbySession/nearbySessionApi.index";
import RightIcon from "../../assets/icon/right.svg?react";
import { useGeolocation } from "../../hooks/useGeolocation";
import type { NearbySessionResponse } from "../../types/api/nearbySession";
import { formatCoordinate } from "../../utils/coordinate";
import { Button } from "../common/button/Button";

import NearbyItem from "./NearbyItem";

const USE_FIXED_LOCATION = import.meta.env.VITE_USE_FIXED_LOCATION === "true";
const SEOUL_CITY_HALL = { x: 127.0017, y: 37.5642 };

export default function NearbyList() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<NearbySessionResponse[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const getOptions = useMemo(() => ({}), []);
  const { location } = useGeolocation(getOptions);

  const x = USE_FIXED_LOCATION
    ? SEOUL_CITY_HALL.x
    : location.x != null
      ? Number(formatCoordinate(location.x))
      : SEOUL_CITY_HALL.x;
  const y = USE_FIXED_LOCATION
    ? SEOUL_CITY_HALL.y
    : location.y != null
      ? Number(formatCoordinate(location.y))
      : SEOUL_CITY_HALL.y;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const list = await nearbySession({ x, y, size: 3 });
        if (!cancelled) setSessions(list);
      } catch {
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [x, y]);

  return (
    <SearchListWrapper>
      <ListHeader>
        <h2>내 주변 추천 러닝</h2>
        <Button
          variant="text"
          size="xs"
          endIcon={<RightIcon />}
          onClick={() => navigate("/search")}
        >
          전체보기
        </Button>
      </ListHeader>

      <ListWrapper>
        {loading && <ListMessage>불러오는 중...</ListMessage>}
        {!loading && sessions?.length === 0 && (
          <ListMessage>
            현 위치 기준으로 조회된 러닝 세션이 없습니다.
          </ListMessage>
        )}
        {!loading &&
          sessions &&
          sessions.length > 0 &&
          sessions.map((session) => (
            <NearbyItem
              key={session.id}
              session={session}
              onClick={() => navigate(`/search/${session.id}`)}
            />
          ))}
      </ListWrapper>
    </SearchListWrapper>
  );
}

const SearchListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  max-width: 330px;
  width: 95%;
`;

const ListHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 20px;

  h2 {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ListMessage = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 90%;
  min-height: 200px;
  padding: 28px 40px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-600);
  text-align: center;
  background: var(--color-gray-100);
  border-radius: 12px;
  border: 2px solid var(--color-gray-200);
  box-sizing: border-box;
`;
