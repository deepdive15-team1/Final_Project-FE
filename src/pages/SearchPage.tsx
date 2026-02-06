import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FILTER_OPTIONS } from "../api/searchsession/searchSessionApi";
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
import type {
  MarkerResponse,
  SessionSummary,
} from "../types/api/searchSession";
import { secondsToPaceString } from "../utils/pace";

export default function SearchPage() {
  const pageHeader = <Header title="러닝 참여하기" />;
  const pageFooter = <Footer />;

  const navigate = useNavigate();

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [markerData, setMarkerData] = useState<MarkerResponse[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(
    null,
  );

  // 마커 데이터 불러오기 (초기 로딩 & 필터 변경 시)
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        // 필터 State를 API 파라미터로 변환
        const params = {
          distance: activeFilters.has("distance") ? 3 : undefined,
          date: activeFilters.has("date") ? "today" : undefined,
          pace: activeFilters.has("pace") ? 600 : undefined,
        };

        // API 호출
        const data = await getMarkers(params);
        setMarkerData(data);
      } catch (error) {
        console.error("마커 로딩 실패:", error);
      }
    };

    fetchMarkers();
  }, [activeFilters]);

  // 특정 마커 클릭 시 요약 정보 불러오기(selectedId가 바뀔 때)
  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedId) {
        setSelectedSession(null);
        return;
      }
      try {
        const data = await getSessionSummary(selectedId);
        setSelectedSession(data);
      } catch (error) {
        console.error("세션 상세 로딩 실패:", error);
      }
    };

    fetchSummary();
  }, [selectedId]);

  const handleToggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(id)) {
        newFilters.delete(id); // 이미 있으면 선택 해제
      } else {
        newFilters.add(id); // 없으면 선택
      }
      return newFilters;
    });
  };

  //마커 데이터 변환 (KaKaoMap Format)
  const mapMarkers = markerData.map((m) => ({
    id: m.sessionId,
    lat: m.latitude,
    lng: m.longitude,
    onClick: () => setSelectedId(m.sessionId),
  }));

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
        />
        {/* 상단 검색바 & 필터 Overlay */}
        <TopOverlay>
          <SearchArea>
            <Input
              variant="neutral"
              placeholder="지역 또는 크루 검색"
              startIcon={<img src={searchIcon} alt="searchIcon"></img>}
              className="search-input"
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
                  // 선택 여부에 따라 스타일 변경
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
