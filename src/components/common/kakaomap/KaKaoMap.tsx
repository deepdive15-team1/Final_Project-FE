import { useState, useEffect, useCallback } from "react";
import {
  Map,
  MapMarker,
  Polyline,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import styled from "styled-components";

import CurrentLocationIcon from "../../../assets/mapicon/currentlocationbutton.svg?react";
import { useGeolocation } from "../../../hooks/useGeolocation";

export interface MarkerType {
  id: number | string;
  //위도
  lat: number;
  //경도
  lng: number;
  // 마커 위에 띄울 텍스트 (없으면 마커만 찍힘)
  content?: string;

  // 커스텀 마커 이미지 설정
  image?: {
    src: string; // 이미지 주소
    size: { width: number; height: number }; // 이미지 크기
    options?: { offset: { x: number; y: number } }; // 이미지 위치 보정
  };

  // 드래그 설정
  draggable?: boolean; // 드래그 가능 여부
  onDragEnd?: (lat: number, lng: number) => void; // 드래그 끝났을 때 좌표 변경 알림

  zIndex?: number;

  //클릭 시 실행할 함수
  onClick?: () => void;
}

interface KaKaoMapProps {
  // 지도 중심 위치 제어
  // 값이 있으면 이 좌표가 지도 중심 위치가 되고, 없으면 현재 위치가 중심
  center?: { lat: number; lng: number };

  // 마커 표시
  // 세션 찾기에서는 여러 개, 세션 개설에서는 한 개(모임장소)
  markers?: MarkerType[];

  // 경로 그리기
  // 세션 개설 시 클릭한 좌표들을 통해 선을 그림
  routePath?: { lat: number; lng: number }[];

  // 지도 설정
  height?: string; //지도 전체 높이
  level?: number; // 지도 확대 레벨

  // 모드 설정
  isCreateMode?: boolean; // true면 지도 클릭 가능
  onMapClick?: (lat: number, lng: number) => void; // 클릭한 좌표를 부모에게 전달

  children?: React.ReactNode;

  // 선 스타일 설정
  lineColor?: string; // 선 색상 -> 라이브러리 컴포넌트에는 직접 Hex Code를 넣어야 함
  lineWeight?: number; // 선 두께
  lineOpacity?: number; // 불투명도
  // 현재 내 위치에 파란 점을 표시할지 여부
  showCurrentLocationMarker?: boolean;
  // 버튼의 하단 위치
  locationBtnBottom?: string;

  // 지도가 처음 생성될 때
  onCreate?: (map: kakao.maps.Map) => void;
  // 드래그가 끝났을 때
  onDragEnd?: (map: kakao.maps.Map) => void;
  // 줌 레벨이 변경되었을 때
  onZoomChanged?: (map: kakao.maps.Map) => void;
}

export const KaKaoMap = ({
  center,
  markers = [],
  routePath,
  height = "100vh",
  level = 3,
  isCreateMode = false,
  onMapClick,
  children,
  lineColor = "#FF3300",
  lineWeight = 5,
  lineOpacity = 0.8,
  showCurrentLocationMarker = false,
  locationBtnBottom = "20px",
  onCreate,
  onDragEnd,
  onZoomChanged,
}: KaKaoMapProps) => {
  // 내 위치 가져오기
  const { location, error, refetch } = useGeolocation();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const [initCenter, setInitCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    // 1순위: 부모가 준 center
    if (center) return center;
    // 2순위: 이미 로드된 내 위치
    if (location.x && location.y) {
      return { lat: location.y as number, lng: location.x as number };
    }
    // 없으면 null
    return null;
  });

  // initCenter가 없고, 위치 정보가 뒤늦게 들어왔다면 바로 initCenter를 채워줌
  if (!initCenter && location.x && location.y) {
    setInitCenter({ lat: location.y as number, lng: location.x as number });
  }

  const centerLat = center?.lat;
  const centerLng = center?.lng;

  useEffect(() => {
    if (map && centerLat !== undefined && centerLng !== undefined) {
      map.panTo(new kakao.maps.LatLng(centerLat, centerLng));
    }
  }, [centerLat, centerLng, map]);

  // 내 위치 찾기 버튼 핸들러
  const handleMyLocationClick = useCallback(() => {
    refetch();

    if (location.x && location.y && map) {
      map.panTo(
        new kakao.maps.LatLng(location.y as number, location.x as number),
      );
    } else if (!location.x && !location.y) {
      alert("위치 정보를 가져올 수 없습니다.");
    }
  }, [location.x, location.y, map, refetch]);

  // 지도 클릭 핸들러
  const handleMapClick = useCallback(
    (_t: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
      if (isCreateMode && onMapClick) {
        const lat = mouseEvent.latLng.getLat();
        const lng = mouseEvent.latLng.getLng();
        onMapClick(lat, lng);
      }
    },
    [isCreateMode, onMapClick],
  );

  const handleMapCreate = (mapInstance: kakao.maps.Map) => {
    setMap(mapInstance);
    if (onCreate) onCreate(mapInstance); // 부모에게 알림
  };

  // 로딩 처리
  if (!initCenter) {
    // 에러 발생 시
    if (error) {
      return (
        <StatusContainer $height={height} $isError>
          <p>위치 정보를 가져올 수 없습니다.</p>
          <ErrorMessage>{error}</ErrorMessage>
        </StatusContainer>
      );
    }
    // 로딩 중
    return (
      <StatusContainer $height={height}>
        <p>현재 위치를 불러오는 중...</p>
      </StatusContainer>
    );
  }

  return (
    <MapContainer $height={height}>
      <Map
        center={initCenter} // 지도의 중심 좌표
        style={{ width: "100%", height: height }} // 지도 크기
        level={level} // 지도 확대 레벨
        onClick={handleMapClick}
        onCreate={handleMapCreate} // 생성 시
        onDragEnd={onDragEnd} // 드래그 종료 시
        onZoomChanged={onZoomChanged} // 줌 변경 시
      >
        {/* 마커 렌더링 */}
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={marker.onClick}
            image={marker.image}
            draggable={marker.draggable}
            zIndex={marker.zIndex}
            onDragEnd={(mapMarker) => {
              marker.onDragEnd?.(
                mapMarker.getPosition().getLat(),
                mapMarker.getPosition().getLng(),
              );
            }}
          >
            {/* content가 있을 때만 마커에 말풍선 표시 */}
            {marker.content && <MarkerContent>{marker.content}</MarkerContent>}
          </MapMarker>
        ))}

        {/* 경로 선 그리기 (좌표 배열이 있을 때만) */}
        {routePath && (
          <Polyline
            path={routePath}
            strokeWeight={lineWeight} // 선 두께
            strokeColor={lineColor} // 선 색상
            strokeOpacity={lineOpacity} // 불투명도
            strokeStyle={"solid"} // 선 스타일
          />
        )}

        {showCurrentLocationMarker && location.x && location.y && (
          <CustomOverlayMap
            position={{ lat: location.y as number, lng: location.x as number }}
            zIndex={0}
          >
            <MyLocationDot />
          </CustomOverlayMap>
        )}

        {children}
      </Map>
      <MyLocationBtn
        onClick={handleMyLocationClick}
        $bottom={locationBtnBottom}
      >
        <CurrentLocationIcon />
      </MyLocationBtn>
    </MapContainer>
  );
};

const MapContainer = styled.div<{ $height: string }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.$height};
`;

const StatusContainer = styled.div<{ $height: string; $isError?: boolean }>`
  width: 100%;
  height: ${(props) => props.$height};
  background-color: ${(props) =>
    props.$isError ? "var(--color-main-light)" : "var(--color-gray-100)"};
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.$isError ? "20px" : "0")};
`;

// 내 위치 찾기 버튼 스타일
const MyLocationBtn = styled.button<{ $bottom: string }>`
  position: absolute;
  bottom: ${(props) => props.$bottom};
  right: 20px;
  z-index: 10;

  width: 42px;
  height: 42px;
  border-radius: 50%;

  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--color-text);

  &:hover {
    background-color: var(--color-main-light);
  }

  &:active {
    background-color: var(--color-gray-200);
  }

  svg {
    min-width: 20px !important;
    min-height: 20px !important;

    color: var(--color-black);
  }
`;

// 에러 메시지 텍스트
const ErrorMessage = styled.p`
  font-size: 12px;
  color: var(--color-end);
  margin-top: 8px;
`;

// 마커 위의 말풍선 (텍스트 박스)
const MarkerContent = styled.div`
  padding: 5px 10px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transform: translate(100%);
`;

const MyLocationDot = styled.div`
  width: 14px;
  height: 14px;
  background-color: var(--color-main);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

  /* 마우스 이벤트 통과 (지도 클릭 방해 안 하게) */
  pointer-events: none;
`;
