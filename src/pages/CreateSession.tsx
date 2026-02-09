import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { getNearbyPlaceName } from "../api/kakaoLocal/kakaoLocalApi";
import ResetIcon from "../assets/icon/reset.png";
import Layout from "../components/Layout";
import Header from "../components/common/header/Header";
import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import SessionBottomSheet, {
  type SessionBottomSheetRef,
} from "../components/session/SessionBottomSheet";
import type { LocationFormData } from "../components/session/SessionForm";
import { getPathLengthKm, roundCoordinate } from "../utils/coordinate";

export default function CreateSession() {
  const pageHeader = <Header title="러닝 세션 개설" />;

  const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>(
    [],
  );
  const [startPlaceName, setStartPlaceName] = useState<string | null>(null);
  const bottomSheetRef = useRef<SessionBottomSheetRef>(null);

  // 시작점 좌표가 바뀔 때마다 해당 좌표의 장소명 조회
  const firstLat = routeNodes[0]?.lat;
  const firstLng = routeNodes[0]?.lng;
  useEffect(() => {
    const first = routeNodes[0];
    if (!first) {
      queueMicrotask(() => setStartPlaceName(null));
      return;
    }
    queueMicrotask(() => setStartPlaceName(null));
    getNearbyPlaceName(first.lng, first.lat).then((name) => {
      setStartPlaceName(name);
    });
  }, [firstLat, firstLng, routeNodes]);

  // 폼에 넘길 위치·경로 데이터 (단일 소스: routeNodes + startPlaceName)
  const locationFormData: LocationFormData = useMemo(
    () => ({
      locationName: startPlaceName ?? "",
      locationX: roundCoordinate(routeNodes[0]?.lng ?? 0),
      locationY: roundCoordinate(routeNodes[0]?.lat ?? 0),
      routePolyline: routeNodes.map((p) => ({
        x: roundCoordinate(p.lng),
        y: roundCoordinate(p.lat),
      })),
      targetDistanceKm: getPathLengthKm(routeNodes),
    }),
    [routeNodes, startPlaceName],
  );

  // 지도 클릭 시 경로에 좌표 추가
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setRouteNodes((prev) => [...prev, { lat, lng }]);
  }, []);

  // 시작점 마커 드래그 종료 시 경로의 첫 번째 좌표 갱신
  const handleStartMarkerDragEnd = useCallback((lat: number, lng: number) => {
    setRouteNodes((prev) =>
      prev.length ? [{ lat, lng }, ...prev.slice(1)] : [{ lat, lng }],
    );
  }, []);

  // 마커 배열 참조 안정화 (지도 불필요 리렌더 방지)
  const markers = useMemo(
    () =>
      routeNodes[0]
        ? [
            {
              id: "start" as const,
              lat: routeNodes[0].lat,
              lng: routeNodes[0].lng,
              draggable: true,
              onDragEnd: handleStartMarkerDragEnd,
            },
          ]
        : [],
    [routeNodes, handleStartMarkerDragEnd],
  );

  const routePath = routeNodes.length >= 2 ? routeNodes : undefined;

  const handleResetRoute = useCallback(() => {
    setRouteNodes([]);
  }, []);

  return (
    <Layout header={pageHeader} scrollable={false}>
      <MapSheetWrapper>
        <KaKaoMap
          height="100%"
          showCurrentLocationMarker={true}
          locationBtnBottom="calc(100% - 54px)"
          isCreateMode={true}
          onMapClick={handleMapClick}
          routePath={routePath}
          markers={markers}
        />
        <MapButtonOverlay>
          <ResetRouteBtn
            type="button"
            onClick={handleResetRoute}
            title="경로 리셋"
          >
            <img src={ResetIcon} alt="경로 리셋" />
          </ResetRouteBtn>
        </MapButtonOverlay>
        <SessionBottomSheet
          ref={bottomSheetRef}
          locationFormData={locationFormData}
        />
      </MapSheetWrapper>
    </Layout>
  );
}

const MapSheetWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const MapButtonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;

  & > * {
    pointer-events: auto;
  }
`;

const ResetRouteBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 70px;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-light);
  }

  &:active {
    background-color: var(--color-gray-200);
  }

  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;
