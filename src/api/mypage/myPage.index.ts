import * as realApi from "./myPage.api.ts";
import * as mockApi from "./myPage.mock.ts";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 내 정보 조회
 */
export const getUserInfo = isMock ? mockApi.getUserInfo : realApi.getUserInfo;

/**
 * 내가 만든 러닝 내역
 */
export const getCreatedRuns = isMock
  ? mockApi.getCreatedRuns
  : realApi.getCreatedRuns;

/**
 * 신청한 러닝 목록
 */
export const getAppliedRuns = isMock
  ? mockApi.getAppliedRuns
  : realApi.getAppliedRuns;

/**
 * 최근 참여 내역
 */
export const getRecentRuns = isMock
  ? mockApi.getRecentRuns
  : realApi.getRecentRuns;
