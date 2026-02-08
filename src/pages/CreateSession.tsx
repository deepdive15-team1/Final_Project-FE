import { useRef, useState } from "react";
import styled from "styled-components";

import Layout from "../components/Layout";
import Header from "../components/common/header/Header";
import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import SessionBottomSheet, {
  type SessionBottomSheetRef,
} from "../components/session/SessionBottomSheet";

export default function CreateSession() {
  const pageHeader = <Header title="러닝 세션 개설" />;

  const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>(
    [],
  );
  const bottomSheetRef = useRef<SessionBottomSheetRef>(null);

  // 지도 클릭 시 경로 추가 + 바텀시트 이외 영역 터치이므로 시트를 초기 높이로 접기
  const handleMapClick = (lat: number, lng: number) => {
    setRouteNodes((prev) => [...prev, { lat, lng }]);
    bottomSheetRef.current?.collapse();
  };

  return (
    <Layout header={pageHeader} scrollable={false}>
      <MapSheetWrapper>
        <KaKaoMap
          height="100%"
          showCurrentLocationMarker={true}
          locationBtnBottom="620px"
          isCreateMode={true}
          onMapClick={handleMapClick}
          routePath={routeNodes.length >= 2 ? routeNodes : undefined}
          markers={
            routeNodes[0]
              ? [
                  {
                    // 시작점에만 마커 찍기
                    id: "start",
                    lat: routeNodes[0].lat,
                    lng: routeNodes[0].lng,
                    content: "출발",
                  },
                ]
              : []
          }
        />
        <SessionBottomSheet ref={bottomSheetRef} routeNodes={routeNodes} />
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
