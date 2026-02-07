// import { useState } from "react";
import styled from "styled-components";

import Layout from "../components/Layout";
import Header from "../components/common/header/Header";
// import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import SessionForm from "../components/session/SessionForm";

export default function CreateSession() {
  const pageHeader = <Header title="러닝 세션 개설" />;

  // const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>(
  //   [],
  // );

  // // 지도 클릭 핸들러 (used in commented map block)
  // const handleMapClick = (lat: number, lng: number) => {
  //   setRouteNodes((prev) => [...prev, { lat, lng }]);
  // };

  return (
    <Layout header={pageHeader}>
      {/* <KaKaoMap
        height="100%"
        showCurrentLocationMarker={true}
        locationBtnBottom="620px"
        isCreateMode={true}
        onMapClick={handleMapClick}
        routePath={routeNodes.length >= 2 ? routeNodes : undefined}
        markers={[
          {
            // 시작점에만 마커 찍기
            id: "start",
            lat: routeNodes[0]?.lat || 0,
            lng: routeNodes[0]?.lng || 0,
            content: "출발",
          },
        ]}
      /> */}

      <BottomSheet style={{ height: "600px" }}>
        <DragIndicator />
        <SessionForm />
      </BottomSheet>
    </Layout>
  );
}

const BottomSheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px 0 rgba(0, 0, 0, 0.08);
`;

const DragIndicator = styled.div`
  width: 40px;
  height: 4px;
  background-color: var(--color-gray-400);
  border-radius: 2px;
`;
