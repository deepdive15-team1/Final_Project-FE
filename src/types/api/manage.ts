export type JoinStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELED";

/**
 * 참여 신청/승인 유저 정보
 */
export interface Participant {
  id: number;
  userId: number;
  userName: string;
  userGender: string;
  userAgeGroup?: string;
  status: JoinStatus;
  messageToHost: string;
  requestedAt: string;

  // UI 표시를 위한 추가 데이터
  mannerTemp?: number;
  weeklyRuns?: number;
  avgPace?: string;
}

export type ParticipantResponse = Participant[];

// 세션 기본 정보 타입 추가
export interface SessionDetail {
  id: number;
  title: string;
}

export type AttendanceStatus = "DEFAULT" | "ATTENDED" | "ABSENT";

// 출석 체크용 멤버 정보
export interface AttendanceMember {
  id: number; // participationId
  userId: number;
  userName: string;
  attendanceStatus: AttendanceStatus;
}

export type AttendanceListResponse = AttendanceMember[];

// 멤버 평가용
export interface EvaluationMember {
  userId: number;
  userName: string;
  mannerTemp: number;
  profileImage?: string;
}

// 호스트 평가용
export interface HostInfo {
  hostId: number;
  name: string;
}

export interface EvaluationRequest {
  sessionId: number;
  score: "GOOD" | "BAD";
  feedbackKeywords: string[];
}

// 고정된 피드백 키워드 리스트 (상수로 사용)
export const FEEDBACK_KEYWORDS = [
  "코스가 좋아요",
  "페이스 조절이 완벽해요",
  "친절해요",
  "매너가 좋아요",
  "시간을 잘 지켜요",
];
