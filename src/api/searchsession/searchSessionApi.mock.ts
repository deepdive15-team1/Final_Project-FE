import type {
  MarkerResponse,
  SessionSummary,
  SessionDetail,
  SliceResponse,
} from "../../types/api/searchSession";

// 지도 마커 더미 데이터
export const MOCK_MARKERS: MarkerResponse[] = [
  { id: 1, y: 36.7945, x: 127.1045, title: "천안아산역 퇴근 러닝" },
  { id: 2, y: 36.8015, x: 127.1085, title: "불당 호수공원 모닝 조깅" },
  { id: 3, y: 36.79, x: 127.102, title: "천안천 인터벌 빡런" },
];

// 세션 요약 더미 데이터
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

// 세션 상세 더미 데이터
export const MOCK_DETAILS: Record<number, SessionDetail> = {
  1: {
    ...MOCK_SUMMARIES[1],
    hostName: "러닝조아",
    hostMannerTemp: 37.5,
    participants: ["철수", "영희", "민수"],
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
      { lat: 36.793, lng: 127.104 },
      { lat: 36.793, lng: 127.107 },
      { lat: 36.793, lng: 127.109 },
      { lat: 36.79, lng: 127.102 },
    ],
  },
};

// 검색 결과 더미 데이터
export const MOCK_SEARCH_RESULT: SliceResponse<SessionSummary> = {
  content: [MOCK_SUMMARIES[1], MOCK_SUMMARIES[2], MOCK_SUMMARIES[3]],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  first: true,
  last: true,
  size: 10,
  number: 0,
  numberOfElements: 3,
  empty: false,
  sort: { empty: true, sorted: false, unsorted: true },
};

// 네트워크 지연 시뮬레이션 유틸
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 마커 조회
 */
export const getMarkers = async (params: {
  distance?: number;
  date?: string;
  pace?: number;
}): Promise<MarkerResponse[]> => {
  await delay(300); // 네트워크 지연

  // 서버 사이드 필터링 흉내내기
  return MOCK_MARKERS.filter((marker) => {
    const detail = MOCK_SUMMARIES[marker.id];
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
 * 세션 요약 정보 조회 (지도 마커 클릭 시)
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
 * 세션 상세 정보 조회 (상세 페이지 진입 시)
 */
export const getSessionDetail = async (
  sessionId: number,
): Promise<SessionDetail> => {
  await delay(300);
  const detail = MOCK_DETAILS[sessionId];
  if (!detail) throw new Error("Session Detail Not Found");
  return detail;
};

/**
 * 세션 검색 API
 */
export const searchSessions = async (
  query: string,
  page = 0,
  size = 10,
): Promise<SliceResponse<SessionSummary>> => {
  await delay(300); // 네트워크 지연

  // 더미 데이터 객체를 배열로 변환
  const allSessions = Object.values(MOCK_SUMMARIES);

  // 검색어 필터링 (검색어가 없으면 전체 반환)
  const filteredSessions = query
    ? allSessions.filter((session) => session.title.includes(query))
    : allSessions;

  // 페이징 처리
  const start = page * size;
  const end = start + size;
  const slicedContent = filteredSessions.slice(start, end);
  const hasNext = end < filteredSessions.length;

  // 공통 정렬 객체
  const sortInfo = { empty: true, sorted: false, unsorted: true };

  return {
    content: slicedContent,
    pageable: {
      pageNumber: page,
      pageSize: size,
      sort: sortInfo,
      offset: start,
      paged: true,
      unpaged: false,
    },
    first: page === 0,
    last: !hasNext,
    size: size,
    number: page,
    numberOfElements: slicedContent.length,
    empty: slicedContent.length === 0,
    sort: sortInfo,
  };
};

/**
 * 세션 참여 신청
 */
export const joinSession = async (
  sessionId: number,
  messageToHost: string,
): Promise<{ success: boolean; message: string }> => {
  await delay(500); // 네트워크 지연

  if (!messageToHost) {
    throw new Error("호스트에게 보낼 메시지를 입력해주세요.");
  }

  return {
    success: true,
    message: "참여 신청이 완료되었습니다.",
  };
};
