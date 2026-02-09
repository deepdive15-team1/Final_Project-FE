import type {
  ParticipantResponse,
  AttendanceListResponse,
  EvaluationMember,
  HostInfo,
  EvaluationRequest,
} from "../../types/api/manage";
import type { CreatedRunning } from "../../types/api/myPage";

// 신청 대기 목록 (REQUESTED)
export const getRequestedParticipants =
  async (): Promise<ParticipantResponse> => {
    return [
      {
        id: 10,
        userId: 101,
        userName: "박서준",
        userGender: "MALE",
        userAgeGroup: "20대",
        status: "REQUESTED",
        messageToHost: "페이스가 저랑 딱 맞네요! 열심히 뛰겠습니다.",
        requestedAt: "2026-02-08T09:00:00",
        mannerTemp: 36.5,
        weeklyRuns: 3,
        avgPace: "5:30",
      },
      {
        id: 11,
        userId: 102,
        userName: "이민지",
        userGender: "FEMALE",
        userAgeGroup: "30대",
        status: "REQUESTED",
        messageToHost: "여의도에서 자주 뛰는데 같이 달리고 싶어요!",
        requestedAt: "2026-02-08T09:05:00",
        mannerTemp: 37.2,
        weeklyRuns: 4,
        avgPace: "5:45",
      },
    ];
  };

// 확정 멤버 목록 (APPROVED)
export const getApprovedParticipants =
  async (): Promise<ParticipantResponse> => {
    return [
      {
        id: 20,
        userId: 201,
        userName: "러너김",
        userGender: "MALE",
        status: "APPROVED",
        messageToHost: "",
        requestedAt: "2026-02-01T10:00:00",
        mannerTemp: 37.0,
      },
      {
        id: 21,
        userId: 202,
        userName: "정수아",
        userGender: "FEMALE",
        status: "APPROVED",
        messageToHost: "",
        requestedAt: "2026-02-01T11:00:00",
        mannerTemp: 36.8,
      },
      {
        id: 22,
        userId: 203,
        userName: "최다은",
        userGender: "FEMALE",
        status: "APPROVED",
        messageToHost: "",
        requestedAt: "2026-02-02T12:00:00",
        mannerTemp: 37.1,
      },
    ];
  };

export const approveParticipant = async (
  sessionId: number,
  participationId: number,
) => {
  alert(`[Mock] Session ${sessionId} - User ${participationId} Approved`);
  return { success: true };
};

export const rejectParticipant = async (
  sessionId: number,
  participationId: number,
) => {
  alert(`[Mock] Session ${sessionId} - User ${participationId} Rejected`);
  return { success: true };
};

// 세션 정보 조회 Mock
export const getSessionDetail = async (
  sessionId: number,
): Promise<CreatedRunning> => {
  return {
    id: sessionId,
    hostUserId: 1,
    title: "여의도 야간 러닝",
    runType: "LSD",
    locationName: "여의도 한강공원",
    locationX: 37.5,
    locationY: 127.0,
    routePolyline: [],
    targetDistanceKm: 5,
    avgPaceSec: 330,
    startAt: "2026-10-25T19:00:00",
    capacity: 10,
    currentParticipants: 5,
    genderPolicy: "OPEN",
    status: "OPEN",
    createdAt: "2026-10-20T10:00:00",
    updatedAt: "2026-10-20T10:00:00",
  };
};

// 출석 체크 목록 조회 Mock
export const getAttendanceList = async (
  _sessionId: number,
): Promise<AttendanceListResponse> => {
  return [
    { id: 10, userId: 101, userName: "박서준", attendanceStatus: "ATTENDED" },
    { id: 11, userId: 102, userName: "김지은", attendanceStatus: "DEFAULT" },
    { id: 12, userId: 103, userName: "이민호", attendanceStatus: "ATTENDED" },
    { id: 13, userId: 104, userName: "최유리", attendanceStatus: "ABSENT" },
  ];
};

// 출석 상태 변경 Mock
export const updateAttendance = async (
  _sessionId: number,
  participationId: number,
  status: "ATTENDED" | "ABSENT",
) => {
  alert(`[Mock] User ${participationId} attendance updated to ${status}`);
};

// 러닝 시작 (세션 상태 변경) Mock
export const startRunningSession = async (sessionId: number) => {
  alert(`[Mock] Session ${sessionId} started!`);
};

// 멤버 평가 목록 조회 Mock (더미)
export const getEvaluationList = async (
  _sessionId: number,
): Promise<EvaluationMember[]> => {
  return [
    { userId: 101, userName: "이민지", mannerTemp: 37.2 },
    { userId: 102, userName: "박서준", mannerTemp: 36.5 },
    { userId: 103, userName: "정수아", mannerTemp: 36.8 },
  ];
};

export const getHostInfo = async (_sessionId: number): Promise<HostInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 딜레이
  return {
    hostId: 101,
    name: "러너김",
  };
};

// 평가 제출
export const submitHostEvaluation = async (data: EvaluationRequest) => {
  const { sessionId } = data;
  if (!sessionId) return { success: false };
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};
