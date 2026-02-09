import type {
  ParticipantResponse,
  AttendanceListResponse,
  EvaluationRequest,
  HostInfo,
  EvaluationMember,
} from "../../types/api/manage";
import type { CreatedRunning } from "../../types/api/myPage";
import { axiosInstance } from "../axiosInstance";

// 참여 목록 조회
export const getParticipants = async (
  sessionId: number,
  status: string,
): Promise<ParticipantResponse> => {
  const { data } = await axiosInstance.get<ParticipantResponse>(
    `/sessions/${sessionId}/join-requests`,
    { params: { status } },
  );
  return data;
};

// 승인
export const approveParticipant = async (
  sessionId: number,
  participationId: number,
) => {
  await axiosInstance.post(
    `/sessions/${sessionId}/join-requests/${participationId}/approve`,
  );
};

// 거절
export const rejectParticipant = async (
  sessionId: number,
  participationId: number,
) => {
  await axiosInstance.post(
    `/sessions/${sessionId}/join-requests/${participationId}/reject`,
  );
};

// 세션 정보 조회 API
export const getSessionDetail = async (
  sessionId: number,
): Promise<CreatedRunning> => {
  const { data } = await axiosInstance.get<CreatedRunning>(
    `/sessions/${sessionId}`,
  );
  return data;
};

// 출석 목록 조회
export const getAttendanceList = async (
  sessionId: number,
): Promise<AttendanceListResponse> => {
  const { data } = await axiosInstance.get<AttendanceListResponse>(
    `/sessions/${sessionId}/attendance`,
  );
  return data;
};

// 출석 상태 변경
export const updateAttendance = async (
  sessionId: number,
  participationId: number,
  status: "ATTENDED" | "ABSENT",
) => {
  await axiosInstance.patch(
    `/sessions/${sessionId}/participants/${participationId}/attendance`,
    {
      attendanceStatus: status,
    },
  );
};

// 러닝 시작
export const startRunningSession = async (sessionId: number) => {
  await axiosInstance.post(`/sessions/${sessionId}/finish`);
};

// 멤버 평가 목록 조회
export const getEvaluationList = async (
  // TODO: 백엔드 api 구현 시 더미 리턴 삭제 후 api 연결
  _sessionId: number,
): Promise<EvaluationMember[]> => {
  return [
    { userId: 101, userName: "이민지", mannerTemp: 37.2 },
    { userId: 102, userName: "박서준", mannerTemp: 36.5 },
    { userId: 103, userName: "정수아", mannerTemp: 36.8 },
  ];
};

// 호스트 정보 조회
export const getHostInfo = async (_sessionId: number): Promise<HostInfo> => {
  // TODO: 백엔드 api 구현 시 더미 리턴 삭제 후 api 연결
  return {
    hostId: 999,
    name: "러너김",
  };
};

// 평가 제출
export const submitHostEvaluation = async (data: EvaluationRequest) => {
  // TODO: 백엔드 api 구현 시 더미 리턴 삭제 후 api 연결
  const { sessionId } = data;
  if (!sessionId) return { success: false };
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};
