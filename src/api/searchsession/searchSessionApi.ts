import type {
  MarkerResponse,
  SessionSummary,
  SessionDetail,
  SliceResponse,
} from "../../types/api/searchSession";
import { axiosInstance } from "../axiosInstance";

/**
 * 지도 세션 마커 조회
 */
export const getMarkers = async (params: {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}): Promise<MarkerResponse[]> => {
  const { data } = await axiosInstance.get<MarkerResponse[]>(
    "/sessions/search/markers",
    {
      params: {
        leftX: params.minLng,
        leftY: params.maxLat,
        rightX: params.maxLng,
        rightY: params.minLat,
      },
    },
  );
  return data;
};

/**
 * 마커 세션 요약 정보 조회
 */
export const getSessionSummary = async (
  sessionId: number,
): Promise<SessionSummary> => {
  const { data } = await axiosInstance.get<SessionSummary>(
    `/sessions/${sessionId}/summary`,
  );
  return data;
};

/**
 * 세션 상세보기
 */
export const getSessionDetail = async (
  sessionId: number,
): Promise<SessionDetail> => {
  const { data } = await axiosInstance.get<SessionDetail>(
    `/sessions/${sessionId}`,
  );
  return data;
};

/**
 * 러닝 이름으로 검색
 */
export const searchSessions = async (
  query: string,
  cursorId?: number,
  size = 10,
): Promise<SliceResponse<SessionSummary>> => {
  const { data } = await axiosInstance.get<SliceResponse<SessionSummary>>(
    "/sessions/search",
    {
      params: {
        q: query,
        cursorId: cursorId,
        size: size,
      },
    },
  );
  return data;
};

/**
 * 러닝 참여
 */
export const joinSession = async (
  sessionId: number,
  messageToHost: string,
): Promise<void> => {
  await axiosInstance.post(`/sessions/${sessionId}/join`, {
    messageToHost, // Request Body
  });
};
