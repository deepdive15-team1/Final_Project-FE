import type {
  UserInfoResponse,
  CreatedRunningResponse,
  AppliedRunningResponse,
  RecentRunningResponse,
} from "../../types/api/myPage";

// 내 정보 Mock
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  return {
    userId: 1,
    name: "러너김",
    ageGroup: "30S",
    gender: "MALE",
    weeklyRuns: 3,
    avgPaceMinPerKm: "5:45",
    mannerTemp: 36.5,
    totalRuns: 15,
    totalDistanceKm: 85.0,
  };
};

// 내가 만든 러닝 Mock
export const getCreatedRuns = async (): Promise<CreatedRunningResponse> => {
  return [
    {
      id: 101,
      hostUserId: 1,
      title: "여의도 야간 러닝",
      runType: "LSD",
      locationName: "여의도 한강공원",
      locationX: 37.5,
      locationY: 126.9,
      routePolyline: [],
      targetDistanceKm: 5,
      avgPaceSec: 360,
      startAt: "2026-02-07T19:00:00.000Z",
      capacity: 5,
      currentParticipants: 3,
      genderPolicy: "MALE_ONLY",
      status: "OPEN",
      createdAt: "2026-02-01T10:00:00.000Z",
      updatedAt: "2026-02-01T10:00:00.000Z",
    },
    {
      id: 102,
      hostUserId: 1,
      title: "주말 모닝 런",
      runType: "RECOVERY",
      locationName: "반포 한강공원",
      locationX: 37.5,
      locationY: 126.9,
      routePolyline: [],
      targetDistanceKm: 3,
      avgPaceSec: 400,
      startAt: "2026-02-08T07:00:00.000Z",
      capacity: 4,
      currentParticipants: 4,
      genderPolicy: "OPEN",
      status: "CLOSED",
      createdAt: "2026-02-02T10:00:00.000Z",
      updatedAt: "2026-02-02T10:00:00.000Z",
    },
  ];
};

// 신청한 러닝
export const getAppliedRuns = async (): Promise<AppliedRunningResponse> => {
  return {
    appliedRunnings: [
      {
        runningId: 1,
        title: "석촌호수 아침 조깅",
        date: "2026-10-25",
        time: "07:00",
        approveStatus: "PENDING",
      },
      {
        runningId: 2,
        title: "탄천 자전거도로 런",
        date: "2026-10-26",
        time: "08:30",
        approveStatus: "APPROVED",
        chatEnabled: true,
      },
    ],
  };
};

// 최근 참여 내역 Mock
export const getRecentRuns = async (): Promise<RecentRunningResponse> => {
  return {
    recentRunnings: [
      {
        runningId: 10,
        title: "반포 한강 런",
        date: "2026-10-20",
        resultStatus: "DONE",
      },
      {
        runningId: 11,
        title: "올림픽공원 러닝",
        date: "2026-10-18",
        resultStatus: "DONE",
      },
    ],
  };
};
