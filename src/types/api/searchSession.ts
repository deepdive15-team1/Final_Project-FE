// Enums
export type GenderPolicy = "MALE_ONLY" | "FEMALE_ONLY" | "MIXED"; // MIXED는 '남녀무관'
export type RunType = "RECOVERY" | "LSD" | "INTERVAL";

export const GENDER_LABEL: Record<GenderPolicy, string> = {
  MALE_ONLY: "남성 전용",
  FEMALE_ONLY: "여성 전용",
  MIXED: "남녀 무관",
};

// 지도 마커 조회용
export interface MarkerResponse {
  id: number;
  title: string;
  x: number;
  y: number;
}

// 세션 요약 정보
export interface SessionSummary {
  id: number;
  title: string;
  startAt: string;
  locationName: string;
  targetDistanceKm: number;
  avgPaceSec: number;
  genderPolicy: GenderPolicy;
  runType: RunType;
}

// 세션 상세 정보
export interface SessionDetail extends SessionSummary {
  hostName: string;
  hostMannerTemp: number;
  participants: string[];

  routePolyline?: { x: number; y: number }[];
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// 검색 결과 페이징
export interface SliceResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: SortObject;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };

  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;

  sort: SortObject;
}
