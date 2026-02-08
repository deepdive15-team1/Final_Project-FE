import { useState } from "react";
import styled from "styled-components";

import Layout from "../components/Layout";
import Header from "../components/common/header/Header";
import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import SessionBottomSheet from "../components/session/SessionBottomSheet";

export default function CreateSession() {
  const pageHeader = <Header title="러닝 세션 개설" />;

  const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>(
    [],
  );

  // 지도 클릭 핸들러 (used in commented map block)
  const handleMapClick = (lat: number, lng: number) => {
    setRouteNodes((prev) => [...prev, { lat, lng }]);
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
        <SessionBottomSheet routeNodes={routeNodes} />
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
