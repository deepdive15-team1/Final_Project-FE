import type {
  MarkerResponse,
  SessionSummary,
  SessionDetail,
  SliceResponse,
} from "../../types/api/searchSession";

// 1. 지도 마커 더미 데이터
export const MOCK_MARKERS: MarkerResponse[] = [
  { sessionId: 1, latitude: 36.7945, longitude: 127.1045 },
  { sessionId: 2, latitude: 36.8015, longitude: 127.1085 },
  { sessionId: 3, latitude: 36.79, longitude: 127.102 },
];

// 2. 세션 요약 더미 데이터
export const MOCK_SUMMARIES: Record<number, SessionSummary> = {
  1: {
    id: 1,
    title: "천안아산역 퇴근 러닝",
    startAt: "2024-05-20T19:30:00",
    locationName: "천안아산역 2번 출구",
    targetDistanceKm: 5,
    avgPaceSec: 360, // 6:00/km
    genderPolicy: "MIXED",
    runType: "RECOVERY",
  },
  2: {
    id: 2,
    title: "불당 호수공원 모닝 조깅",
    startAt: "2024-05-21T06:00:00",
    locationName: "불당 호수공원 입구",
    targetDistanceKm: 3,
    avgPaceSec: 420, // 7:00/km
    genderPolicy: "FEMALE_ONLY",
    runType: "RECOVERY",
  },
  3: {
    id: 3,
    title: "천안천 인터벌 빡런",
    startAt: "2024-05-21T21:00:00",
    locationName: "와이시티 앞 천변",
    targetDistanceKm: 10,
    avgPaceSec: 300, // 5:00/km
    genderPolicy: "MALE_ONLY",
    runType: "INTERVAL",
  },
};

// 3. 세션 상세 더미 데이터
export const MOCK_DETAILS: Record<number, SessionDetail> = {
  1: {
    ...MOCK_SUMMARIES[1],
    hostName: "러닝조아",
    hostMannerTemp: 37.5,
    participants: ["철수", "영희", "민수"],
    // 천안아산역 크게 한 바퀴
    routeNodes: [
      { lat: 36.7945, lng: 127.1045 },
      { lat: 36.7955, lng: 127.1055 },
      { lat: 36.7935, lng: 127.1065 },
      { lat: 36.7925, lng: 127.104 },
    ],
  },
  2: {
    ...MOCK_SUMMARIES[2],
    hostName: "아침형인간",
    hostMannerTemp: 40.2,
    participants: ["영희", "지수"],
    routeNodes: [
      { lat: 36.8015, lng: 127.1085 },
      { lat: 36.802, lng: 127.109 },
      { lat: 36.801, lng: 127.1095 },
    ],
  },
  3: {
    ...MOCK_SUMMARIES[3],
    hostName: "마라톤풀코스",
    hostMannerTemp: 99.9,
    participants: ["철수", "민수", "동혁", "준호", "준수", "지호"],
    routeNodes: [
      { lat: 36.79, lng: 127.102 },
      { lat: 36.791, lng: 127.1025 },
      { lat: 36.792, lng: 127.103 },
      { lat: 36.793, lng: 127.1035 },
    ],
  },
};

// 검색 결과 더미 데이터
export const MOCK_SEARCH_RESULT: SliceResponse<SessionSummary> = {
  content: [MOCK_SUMMARIES[1], MOCK_SUMMARIES[2], MOCK_SUMMARIES[3]],
  pageable: { pageNumber: 0, pageSize: 10 },
  first: true,
  last: true,
  size: 10,
  number: 0,
  numberOfElements: 3,
  empty: false,
};

// 필터 옵션
export const FILTER_OPTIONS = [
  { id: "distance", label: "5km 이내", value: 5 },
  { id: "date", label: "오늘", value: "today" },
  { id: "pace", label: "페이스 6:00", value: 600 },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. 마커 조회 (필터링 시뮬레이션 포함)
 */
export const getMarkers = async (params: {
  distance?: number;
  date?: string;
  pace?: number;
}): Promise<MarkerResponse[]> => {
  await delay(300);

  return MOCK_MARKERS.filter((marker) => {
    const detail = MOCK_SUMMARIES[marker.sessionId];
    if (!detail) return false;

    // 거리 필터
    if (params.distance && detail.targetDistanceKm > params.distance)
      return false;

    // 페이스 필터
    if (params.pace && detail.avgPaceSec > params.pace) return false;

    // 날짜 필터
    if (params.date === "today") {
      return true;
    }

    return true;
  });
};

/**
 * 2. 세션 요약 정보 조회
 */
export const getSessionSummary = async (
  sessionId: number,
): Promise<SessionSummary> => {
  await delay(200);
  const summary = MOCK_SUMMARIES[sessionId];
  if (!summary) throw new Error("Session Summary Not Found");
  return summary;
};

/**
 * 3. 세션 상세 정보 조회
 */
export const getSessionDetail = async (
  sessionId: number,
): Promise<SessionDetail> => {
  await delay(300);
  const detail = MOCK_DETAILS[sessionId];
  if (!detail) throw new Error("Session Detail Not Found");
  return detail;
};
