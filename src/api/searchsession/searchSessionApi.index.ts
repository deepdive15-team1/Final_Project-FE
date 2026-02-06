import {
  getMarkers as mockGetMarkers,
  getSessionSummary as mockGetSessionSummary,
  getSessionDetail as mockGetSessionDetail,
} from "./searchSessionApi.mock";
import {
  getMarkers as realGetMarkers,
  getSessionSummary as realGetSessionSummary,
  getSessionDetail as realGetSessionDetail,
} from "./searchSessionApi.ts";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 지도 마커 조회
 */
export const getMarkers = isMock ? mockGetMarkers : realGetMarkers;

/**
 * 특정 세션의 요약 정보 조회
 */
export const getSessionSummary = isMock
  ? mockGetSessionSummary
  : realGetSessionSummary;

/**
 * 세션 상세 정보 조회
 */
export const getSessionDetail = isMock
  ? mockGetSessionDetail
  : realGetSessionDetail;
