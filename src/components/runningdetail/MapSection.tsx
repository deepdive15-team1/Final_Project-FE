import { useMemo } from "react";
import styled from "styled-components";

import type { SessionDetail } from "../../types/api/searchSession";
import { KaKaoMap } from "../common/kakaomap/KaKaoMap";

interface Props {
  session: SessionDetail;
}

export default function MapSection({ session }: Props) {
  const routePath = useMemo(() => {
    if (!session.routePolyline) return [];

    // x(경도) -> lng, y(위도) -> lat 매핑
    return session.routePolyline.map((node) => ({
      lat: node.y,
      lng: node.x,
    }));
  }, [session]);
  const hasRoute = routePath.length > 0;

  // 마커 생성 로직 (지도 컴포넌트용)
  const mapMarkers = useMemo(() => {
    if (!hasRoute) return [];
    const startNode = routePath[0];
    const endNode = routePath[routePath.length - 1];

    const markers = [{ id: "start", lat: startNode.lat, lng: startNode.lng }];

    // 시작점 != 끝점일 때만 도착 마커 추가
    const isSamePoint =
      startNode.lat === endNode.lat && startNode.lng === endNode.lng;
    if (!isSamePoint) {
      markers.push({ id: "end", lat: endNode.lat, lng: endNode.lng });
    }
    return markers;
  }, [routePath, hasRoute]);

  return (
    <Container>
      {hasRoute ? (
        <KaKaoMap
          height="100%"
          routePath={routePath}
          level={5}
          center={routePath[0]}
          markers={mapMarkers}
          showCurrentLocationMarker={false}
          isCreateMode={false}
        />
      ) : (
        <NoMapPlaceholder>
          <span>러닝 루트가 등록되지 않았습니다.</span>
        </NoMapPlaceholder>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 240px;
  background-color: var(--color-gray-100);
`;

const NoMapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-gray-400);
  font-size: 14px;
`;
