import {
  useState,
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  getMarkers,
  getSessionSummary,
} from "../api/searchsession/searchSessionApi.index";
import searchIcon from "../assets/icon/search.svg";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import { CardBase } from "../components/common/cardbase/CardBase";
import Chip from "../components/common/chip";
import Footer from "../components/common/footer/Footer";
import Header from "../components/common/header/Header";
import { Input } from "../components/common/input/Input";
import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import { FILTER_OPTIONS } from "../components/runningdetail/FilterOptions";
import type {
  MarkerResponse,
  SessionSummary,
} from "../types/api/searchSession";
import { secondsToPaceString } from "../utils/pace";

export default function SearchPage() {
  const pageHeader = <Header title="러닝 참여하기" />;
  const pageFooter = <Footer />;

  const navigate = useNavigate();
  const lastParamsRef = useRef<string>("");

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [markerData, setMarkerData] = useState<MarkerResponse[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(
    null,
  );

  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 데이터 로딩 함수
  const fetchSessions = useCallback(
    async (map: kakao.maps.Map, filters: Set<string>) => {
      if (!map) return;

      try {
        // 지도 좌표 가져오기
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // 파라미터 통합 (좌표 + 필터)
        const params = {
          // 좌표
          minLng: sw.getLng(),
          minLat: sw.getLat(),
          maxLng: ne.getLng(),
          maxLat: ne.getLat(),

          // 필터
          distance: filters.has("distance") ? 3 : undefined,
          date: filters.has("date") ? "today" : undefined,
          pace: filters.has("pace") ? 600 : undefined,
        };

        // 기존 요청과 같다면 API 요청 하지 않음
        const currentParamsStr = JSON.stringify(params);
        if (lastParamsRef.current === currentParamsStr) {
          return;
        }

        // 새로운 요청이라면 기억해두고 진행
        lastParamsRef.current = currentParamsStr;

        // API 호출
        const data = await getMarkers(params);
        setMarkerData(data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    },
    [],
  );

  // 지도 생성 시 딱 한 번 실행 (State 저장)
  const handleCreate = useCallback(
    (map: kakao.maps.Map) => {
      setMapInstance(map);
      fetchSessions(map, activeFilters);
    },
    [fetchSessions, activeFilters],
  );

  // 드래그/줌 종료 이벤트 핸들러 (State 저장 없이 데이터만 요청)
  const handleMapEvent = useCallback(
    (map: kakao.maps.Map) => {
      fetchSessions(map, activeFilters);
    },
    [activeFilters, fetchSessions],
  );

  // 특정 마커 클릭 시 요약 정보 불러오기
  const handleMarkerClick = async (id: number) => {
    setSelectedId(id);

    try {
      const data = await getSessionSummary(id);
      setSelectedSession(data);
    } catch (err) {
      console.error("세션 상세 로딩 실패", err);
    }
  };

  // 검색 페이지로 이동
  const goToSearchList = useCallback(() => {
    if (!searchKeyword.trim()) return;
    navigate(`/search/list?q=${encodeURIComponent(searchKeyword)}`);
  }, [searchKeyword, navigate]);

  // 엔터 키 감지 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      goToSearchList();
    }
  };

  // 필터 클릭 핸들러
  const handleToggleFilter = (id: string) => {
    const nextFilters = new Set(activeFilters);
    if (nextFilters.has(id)) nextFilters.delete(id);
    else nextFilters.add(id);

    setActiveFilters(nextFilters);

    // 지도가 로드되어 있다면, 현재 지도 좌표와 새로운 필터로 데이터 요청
    if (mapInstance) {
      fetchSessions(mapInstance, nextFilters);
    }
  };

  //마커 데이터 변환

  const mapMarkers = useMemo(() => {
    return markerData.map((m) => ({
      id: m.id,
      lat: m.y,
      lng: m.x,
      onClick: () => handleMarkerClick(m.id),
    }));
  }, [markerData]);

  return (
    <Layout scrollable={false} header={pageHeader} footer={pageFooter}>
      <MapContainer>
        <KaKaoMap
          height="100%"
          markers={mapMarkers}
          // 하단 카드가 뜨면 내 위치 버튼을 위로 올림
          locationBtnBottom={selectedId ? "170px" : "80px"}
          isCreateMode={false}
          showCurrentLocationMarker={true}
          onCreate={handleCreate}
          onDragEnd={handleMapEvent}
          onZoomChanged={handleMapEvent}
        />
        {/* 상단 검색바 & 필터 Overlay */}
        <TopOverlay>
          <SearchArea>
            <Input
              variant="neutral"
              placeholder="지역 또는 크루 검색"
              endIcon={
                <img
                  src={searchIcon}
                  alt="searchIcon"
                  style={{ cursor: "pointer" }}
                  onClick={goToSearchList}
                />
              }
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </SearchArea>

          <FilterList>
            {FILTER_OPTIONS.map((filter) => {
              const isSelected = activeFilters.has(filter.id);

              return (
                <Chip
                  key={filter.id}
                  label={filter.label}
                  size="small"
                  clickable
                  variant="filled"
                  color={isSelected ? "primary" : "default"}
                  onClick={() => handleToggleFilter(filter.id)}
                />
              );
            })}
          </FilterList>
        </TopOverlay>

        {/* 하단 세션 요약 카드*/}
        {selectedSession && (
          <StyledBottomCard>
            <CardContent>
              <div className="text-info">
                <h3 className="title">{selectedSession.title}</h3>
                <p className="sub-info">
                  {selectedSession.startAt.split("T")[0]} ·{" "}
                  {selectedSession.locationName}
                </p>
                <TagList>
                  <Chip
                    label={`${selectedSession.targetDistanceKm}km`}
                    size="small"
                    color="default"
                    variant="filled"
                  />
                  <Chip
                    label={`${secondsToPaceString(selectedSession.avgPaceSec)}/km`}
                    size="small"
                    color="default"
                    variant="filled"
                  />
                  <Chip
                    label={selectedSession.runType}
                    size="small"
                    color="default"
                    variant="filled"
                  />
                </TagList>
              </div>
            </CardContent>

            <ButtonWrapper>
              <Button
                size="xs"
                variant="primary"
                onClick={() => navigate(`/search/${selectedSession.id}`)}
              >
                상세보기
              </Button>
            </ButtonWrapper>
          </StyledBottomCard>
        )}
      </MapContainer>
    </Layout>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const TopOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none; // 배경 클릭 시 지도로 이벤트 통과

  // Input과 Chip의 클릭 이벤트는 허용
  & > * {
    pointer-events: auto;
  }
`;

const SearchArea = styled.div`
  width: 100%;
`;

const FilterList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledBottomCard = styled(CardBase)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  width: auto;
  box-sizing: border-box;

  z-index: 10;
  animation: slideUp 0.3s ease-out;
  padding: 20px;

  text-align: left;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;

  .text-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    .title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      color: var(--color-text);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .sub-info {
      font-size: 13px;
      color: var(--color-gray-600);
      margin: 0;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
`;

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 8px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  flex-shrink: 0;
`;
