import { useState, useMemo } from "react";
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
  // 버튼의 하단 위치 (기본값: "20px")
  locationBtnBottom?: string;
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
}: KaKaoMapProps) => {
  // 내 위치 가져오기
  const { location, error, isLoading } = useGeolocation();

  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  /**
   * 중심 좌표 계산 우선순위
   * 1순위: 부모가 내려준 center
   * 2순위: 내 위치 찾기 버튼을 눌러서 업데이트된 myLocation
   * 3순위: Geolocation으로 가져온 실시간 location (초기 렌더링용)
   */
  const activeCenter = useMemo(() => {
    if (center) return center;
    if (myLocation) return myLocation;

    return { lat: location.y as number, lng: location.x as number };
  }, [center, myLocation, location.x, location.y]);

  // 내 위치 찾기 버튼 핸들러
  const handleMyLocationClick = () => {
    // 지도가 로드되어 있고, 내 위치 정보가 있을 때
    if (map && location.x && location.y) {
      // 카카오맵 명령어로 직접 이동
      map.panTo(new kakao.maps.LatLng(location.y, location.x));
      // 버튼 클릭 시 state를 업데이트하여 activeCenter가 변경되도록 함
      setMyLocation({ lat: location.y, lng: location.x });
    } else {
      alert("위치 정보를 가져올 수 없습니다.");
    }
  };

  // 로딩 처리: center props가 없는 경우, 좌표값(x, y)이 하나라도 없으면 무조건 로딩으로 간주

  const isGeoLocationReady = !isLoading && location.x && location.y;

  if (!center && !isGeoLocationReady) {
    return (
      <StatusContainer $height={height}>
        <p>현재 위치를 불러오는 중...</p>
      </StatusContainer>
    );
  }

  // 에러 처리
  if (error && !center) {
    return (
      <StatusContainer $height={height} $isError>
        <p>위치 정보를 가져올 수 없습니다.</p>
        <ErrorMessage>{error}</ErrorMessage>
      </StatusContainer>
    );
  }
  return (
    <MapContainer $height={height}>
      <Map
        center={activeCenter} // 지도의 중심 좌표
        style={{ width: "100%", height: height }} // 지도 크기
        level={level} // 지도 확대 레벨
        isPanto={true}
        onCreate={setMap}
        onClick={(_t, mouseEvent) => {
          if (isCreateMode && onMapClick) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            onMapClick(lat, lng);
          }
        }}
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
              // 드래그가 끝나면 변경된 좌표를 부모에게 알려줌
              if (marker.onDragEnd) {
                const pos = mapMarker.getPosition();
                marker.onDragEnd(pos.getLat(), pos.getLng());
              }
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
  background-color: var(--color-bg);
  border: 1px solid var(--color-gray-400);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
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
