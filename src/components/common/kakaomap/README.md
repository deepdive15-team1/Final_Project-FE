# 🗺️ KaKaoMap 공통 컴포넌트

`react-kakao-maps-sdk`를 기반으로 성능 최적화가 적용된 공통 지도 컴포넌트입니다.
**불필요한 리렌더링을 방지**하도록 설계되었으며, 초기 위치 자동 설정, 부드러운 이동 애니메이션(`panTo`), 마커 드래그, 경로 그리기 등을 지원합니다.

## ✨ 주요 기능

- **🚀 성능 최적화**: `Lazy Initialization`과 `Memoization`을 적용하여 지도 깜빡임과 재렌더링을 최소화했습니다.
- **📍 부드러운 이동**: 부모 컴포넌트에서 `center` props가 변경되면, 지도가 끊김 없이 부드럽게 해당 위치로 이동합니다 (Imperative Update).
- **자동 초기 위치**: 컴포넌트 마운트 시 사용자 위치(GPS)를 받아 지도의 시작점을 자동으로 설정합니다.
- **UX 친화적 로딩**: 초기 위치를 잡을 때만 로딩 화면을 보여주고, 이후에는 지도를 유지합니다.
- **마커 & 드래그**: 클릭, 커스텀 이미지뿐만 아니라 **드래그 후 좌표 반환(`onDragEnd`)** 기능을 지원합니다.
- **UI 유동성**: `locationBtnBottom` 속성으로 하단 UI(Bottom Sheet 등)에 맞춰 '내 위치 찾기' 버튼 위치를 조절할 수 있습니다.

---

## 🛠️ Props API

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| `center` | `{ lat: number, lng: number }` | `undefined` | 지도의 중심 좌표를 설정합니다. **값이 변경되면 지도가 해당 위치로 부드럽게 이동**합니다. |
| `markers` | `MarkerType[]` | `[]` | 지도에 표시할 마커 배열입니다. (클릭, 드래그 이벤트 지원) |
| `routePath` | `{ lat: number, lng: number }[]` | `undefined` | 지도에 그릴 경로(Polyline)의 좌표 배열입니다. |
| `height` | `string` | `"100vh"` | 지도의 높이값 (px, %, vh 등) |
| `level` | `number` | `3` | 지도의 확대 레벨 (작을수록 확대) |
| `isCreateMode` | `boolean` | `false` | `true`일 경우 지도 배경 클릭 이벤트를 활성화합니다. |
| `onMapClick` | `(lat, lng) => void` | `undefined` | `isCreateMode`가 true일 때, 지도 빈 곳을 클릭하면 실행되는 콜백입니다. |
| `showCurrentLocationMarker` | `boolean` | `false` | 현재 내 위치에 파란색 점(오버레이)을 표시합니다. |
| `locationBtnBottom` | `string` | `"20px"` | **내 위치 찾기 버튼의 하단 위치**입니다. (예: "150px") |
| `children` | `ReactNode` | `undefined` | 지도 위에 띄울 추가 UI (예: Custom Overlay) |

---

## 📂 Type Reference

### `MarkerType`
마커를 정의하는 객체 타입입니다.

```typescript
export interface MarkerType {
  id: number | string;
  lat: number;
  lng: number;
  content?: string; // 마커 위 말풍선 텍스트
  
  // 커스텀 이미지 설정
  image?: {        
    src: string;
    size: { width: number; height: number };
    options?: { offset: { x: number; y: number } };
  };

  // 인터랙션 설정
  draggable?: boolean; // 드래그 가능 여부
  onDragEnd?: (lat: number, lng: number) => void; // 드래그 종료 시 좌표 반환
  onClick?: () => void; // 클릭 시 실행할 함수
  
  zIndex?: number;
}
```
## ⚠️ 백엔드 연동 시 주의사항 (좌표 변환)
프론트엔드(카카오맵)와 백엔드 API의 좌표 변수명이 다를 수 있습니다. 데이터를 서버로 전송하기 직전에 반드시 매핑(Mapping) 과정을 거쳐야 합니다.

 - Frontend (KaKaoMap): lat (위도), lng (경도)

 - Backend (Spring/JPA): x (경도), y (위도) 또는 Point(x, y)

### ✅ 변환 코드 예시
```TypeScript
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
### 1. 기본 조회 모드 (데이터 시각화)
세션 찾기 페이지 등에서 마커를 보여줄 때 사용합니다. center 값을 변경하면 지도가 이동합니다.

``` TypeScript
import { useState } from "react";
import { KaKaoMap } from "./components/common/KaKaoMap";

const ViewMap = () => {
  // 예: 검색 결과에 따라 중심 좌표 변경
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });

  const dummyMarkers = [
    { id: 1, lat: 37.5665, lng: 126.9780, content: "서울시청" },
    { id: 2, lat: 37.5642, lng: 126.9745, content: "덕수궁" }
  ];

  return (
    <KaKaoMap 
      height="500px"
      center={mapCenter} // 이 값이 바뀌면 지도가 스르륵 이동함
      markers={dummyMarkers}
      showCurrentLocationMarker={true} 
    />
  );
};
```
### 2. 생성 모드 (러닝 코스 그리기)
세션 개설 페이지에서 경로를 찍을 때 사용합니다.

```TypeScript
import { useState, useCallback } from "react";
import { KaKaoMap } from "./components/common/KaKaoMap";

const CreateSession = () => {
  const [routeNodes, setRouteNodes] = useState<{ lat: number; lng: number }[]>([]);

  // 지도 클릭 핸들러 (useCallback 권장)
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setRouteNodes((prev) => [...prev, { lat, lng }]);
  }, []);

  return (
    <KaKaoMap
      isCreateMode={true}        // 클릭 모드 활성화
      onMapClick={handleMapClick} // 클릭 시 좌표 수신
      routePath={routeNodes}      // 찍은 좌표대로 선 그리기
      markers={[{                // 시작점 마커 표시
         id: "start",
         lat: routeNodes[0]?.lat || 0, 
         lng: routeNodes[0]?.lng || 0,
         content: "출발"
      }]}
    />
  );
};
```
### 3. 모임 장소 핀 찍기 (드래그 가능한 마커)
사용자가 직접 핀을 움직여 정확한 위치를 설정해야 할 때 사용합니다.

```TypeScript
const PinSelectMap = () => {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);

  // 마커 드래그가 끝났을 때 실행
  const handleMarkerDragEnd = (lat: number, lng: number) => {
    console.log("변경된 좌표:", lat, lng);
    setPin({ lat, lng });
  };

  return (
    <KaKaoMap 
      markers={pin ? [{
        id: "meeting-point",
        lat: pin.lat,
        lng: pin.lng,
        draggable: true,             // ✅ 드래그 가능 설정
        onDragEnd: handleMarkerDragEnd // ✅ 드래그 종료 콜백
      }] : []}
    />
  );
};
```
### 4. UI 레이아웃 대응 (Bottom Sheet)
하단 UI가 지도를 가리지 않도록 버튼 위치를 조정합니다.

```TypeScript
const SessionDetail = () => {
  return (
    <div style={{ position: 'relative' }}>
      <KaKaoMap 
        height="100vh"
        // 하단 패널 높이(200px) + 여백(20px) 만큼 버튼을 위로 올림
        locationBtnBottom="220px" 
      />
      
      {/* 하단 패널 */}
      <div style={{ height: "200px", position: "absolute", bottom: 0, width: "100%" }}>
        상세 정보 패널
      </div>
    </div>
  );
};
```