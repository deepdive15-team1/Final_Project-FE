# 🗺️ KaKaoMap 공통 컴포넌트

`react-kakao-maps-sdk`를 기반으로 래핑된 공통 지도 컴포넌트입니다.
현재 위치 추적, 마커 표시, 경로(Polyline) 그리기, 주소 클릭 이벤트 등을 처리할 수 있으며, **하단 UI(Bottom Sheet 등)에 맞춰 버튼 위치를 유동적으로 조절**할 수 있습니다.

## ✨ 주요 기능

- **자동 위치 추적**: 컴포넌트 마운트 시 사용자 위치로 자동 이동합니다.
- **로딩 처리**: 위치 정보를 불러오는 동안 로딩 화면을 표시합니다.
- **마커 관리**: 클릭 이벤트, 커스텀 이미지, 드래그 기능을 지원하는 마커를 렌더링합니다.
- **경로 그리기**: 좌표 배열(`routePath`)을 받아 지도 위에 선을 그립니다.
- **생성 모드**: 지도 클릭 시 좌표를 반환하여 러닝 코스를 생성할 수 있습니다.
- **UI 유동성**: `locationBtnBottom` 속성으로 내 위치 찾기 버튼의 높이를 자유롭게 조절합니다.

---

## 🛠️ Props API

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| `center` | `{ lat: number, lng: number }` | `undefined` | 지도의 중심 좌표를 강제로 설정합니다. (없으면 현 위치) |
| `markers` | `MarkerType[]` | `[]` | 지도에 표시할 마커 배열입니다. |
| `routePath` | `{ lat: number, lng: number }[]` | `undefined` | 지도에 그릴 경로(선)의 좌표 배열입니다. |
| `height` | `string` | `"100vh"` | 지도의 높이값 (px, %, vh 등) |
| `level` | `number` | `3` | 지도의 확대 레벨 (작을수록 확대) |
| `isCreateMode` | `boolean` | `false` | `true`일 경우 지도 클릭 이벤트를 활성화합니다. |
| `onMapClick` | `(lat, lng) => void` | `undefined` | `isCreateMode`가 true일 때, 지도 클릭 시 실행되는 콜백입니다. |
| `showCurrentLocationMarker` | `boolean` | `false` | 현재 내 위치에 파란색 점(오버레이)을 표시합니다. |
| `locationBtnBottom` | `string` | `"20px"` | **내 위치 찾기 버튼의 하단 위치**입니다. (예: "150px") |
| `children` | `ReactNode` | `undefined` | 지도 위에 띄울 추가 UI (예: Bottom Sheet) |

---

## ⚠️ 백엔드 연동 시 주의사항 (좌표 변환)

**프론트엔드(카카오맵)와 백엔드 API의 좌표 변수명이 다릅니다!** 데이터를 서버로 전송하기 직전에 **반드시 매핑(Mapping)** 과정을 거쳐야 합니다.

- **Frontend (KaKaoMap)**: `lat` (위도), `lng` (경도)
- **Backend (API)**: `x` (경도), `y` (위도)

### ✅ 변환 코드 예시

```typescript
// 1. 컴포넌트에서 관리하는 좌표 (lat, lng)
const routeNodes = [
  { lat: 37.123, lng: 127.123 },
  { lat: 37.456, lng: 127.456 }
];

// 2. 백엔드 전송 시 변환 (Mapping)
const payload = {
  // ...다른 데이터
  routePolyline: routeNodes.map(node => ({
    x: node.lng, // 경도 (Longitude) -> x
    y: node.lat  // 위도 (Latitude)  -> y
  }))
};

// axios.post('/api/session', payload);
```

## 🚀 사용 예시

### 1. 기본 조회 모드 (마커 표시)
세션 찾기 페이지 등에서 마커를 보여줄 때 사용합니다.
```typescript
import { KaKaoMap } from "./components/common/KaKaoMap";

const ViewMap = () => {
  const dummyMarkers = [
    { id: 1, lat: 37.5665, lng: 126.9780, content: "서울시청" },
    { id: 2, lat: 37.5642, lng: 126.9745, content: "덕수궁" }
  ];

  return (
    <KaKaoMap 
      height="500px"
      markers={dummyMarkers}
      showCurrentLocationMarker={true} 
    />
  );
};
```

### 2. 생성 모드 (러닝 코스 그리기)
세션 개설 페이지에서 경로를 찍을 때 사용합니다.
```typescript
import { useState } from "react";
import { KaKaoMap } from "./components/common/KaKaoMap";

const CreateSession = () => {
  // 경로 좌표 관리
  const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>([]);

  // 지도 클릭 핸들러
  const handleMapClick = (lat: number, lng: number) => {
    setRouteNodes((prev) => [...prev, { lat, lng }]);
  };

  return (
    <KaKaoMap
      isCreateMode={true}        // 클릭 모드 활성화
      onMapClick={handleMapClick} // 클릭 시 좌표 수신
      routePath={routeNodes}      // 찍은 좌표대로 선 그리기
      markers={[{                // 시작점에만 마커 찍기 예시
         id: "start",
         lat: routeNodes[0]?.lat || 0, 
         lng: routeNodes[0]?.lng || 0,
         content: "출발"
      }]}
    />
  );
};
```

### 3. UI 레이아웃 대응 (버튼 위치 조절)
하단 패널(Bottom Sheet)이나 카드가 있을 때, 버튼이 가려지지 않도록 위치를 조정합니다.
```typescript
const SessionDetail = () => {
  return (
    <>
      <KaKaoMap 
        height="100vh"
        // 하단 패널 높이(200px) + 여백(20px) 만큼 위로 올림
        locationBtnBottom="220px" 
      />
      <BottomSheet style={{ height: "200px" }}>
        {/* 하단 패널 내용 */}
      </BottomSheet>
    </>
  );
};
```

## 📂 Type Reference
```typescript
export interface MarkerType {
  id: number | string;
  lat: number;
  lng: number;
  content?: string; // 마커 위 텍스트
  image?: {         // 커스텀 이미지
    src: string;
    size: { width: number; height: number };
    options?: { offset: { x: number; y: number } };
  };
  draggable?: boolean;
  onDragEnd?: (lat: number, lng: number) => void;
  zIndex?: number;
  onClick?: () => void;
}
```