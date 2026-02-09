/**
 * 내 정보 조회 응답
 */
export interface UserInfoResponse {
  userId: number;
  name: string;
  ageGroup: string;
  gender: string;
  weeklyRuns: number;
  avgPaceMinPerKm: string;
  mannerTemp: number;
  totalRuns: number;
  totalDistanceKm: number;
}

/**
 * 내가 만든 러닝 (호스트) 단일 아이템
 */
export interface CreatedRunning {
  id: number;
  hostUserId: number;
  title: string;
  runType: string;
  locationName: string;
  locationX: number;
  locationY: number;
  routePolyline: { x: number; y: number }[];
  targetDistanceKm: number;
  avgPaceSec: number;
  startAt: string;
  capacity: number;
  currentParticipants: number;
  genderPolicy: string;
  status: "OPEN" | "CLOSED" | "CANCELED" | "FINISHED";
  createdAt: string;
  updatedAt: string;
}

/**
 * 내가 만든 러닝 응답
 */
export type CreatedRunningResponse = CreatedRunning[];

/**
 * 신청한 러닝 (게스트) 단일 아이템
 */
export interface AppliedRunning {
  runningId: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  approveStatus: "PENDING" | "APPROVED" | "REJECTED";
  chatEnabled?: boolean;
}

/**
 * 신청한 러닝 응답 Wrapper
 */
export interface AppliedRunningResponse {
  appliedRunnings: AppliedRunning[];
}

/**
 * 최근 참여 내역 단일 아이템
 */
export interface RecentRunning {
  runningId: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  resultStatus: "DONE" | "NOSHOW";
}

/**
 * 최근 참여 내역 응답
 */
export interface RecentRunningResponse {
  recentRunnings: RecentRunning[];
}
