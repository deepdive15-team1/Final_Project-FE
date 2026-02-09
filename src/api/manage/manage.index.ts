import * as realApi from "./manage.api";
import * as mockApi from "./manage.mock";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

export const getRequestedList = async (sessionId: number) => {
  return isMock
    ? mockApi.getRequestedParticipants()
    : realApi.getParticipants(sessionId, "REQUESTED");
};

export const getApprovedList = async (sessionId: number) => {
  return isMock
    ? mockApi.getApprovedParticipants()
    : realApi.getParticipants(sessionId, "APPROVED");
};

export const approveUser = isMock
  ? mockApi.approveParticipant
  : realApi.approveParticipant;
export const rejectUser = isMock
  ? mockApi.rejectParticipant
  : realApi.rejectParticipant;

export const getSessionDetail = isMock
  ? mockApi.getSessionDetail
  : realApi.getSessionDetail;

export const getSessionInfo = isMock
  ? mockApi.getSessionDetail
  : realApi.getSessionDetail;

export const getAttendanceList = isMock
  ? mockApi.getAttendanceList
  : realApi.getAttendanceList;
export const updateAttendance = isMock
  ? mockApi.updateAttendance
  : realApi.updateAttendance;
export const startRunningSession = isMock
  ? mockApi.startRunningSession
  : realApi.startRunningSession;

export const getEvaluationList = isMock
  ? mockApi.getEvaluationList
  : realApi.getEvaluationList;

export const getHostInfo = isMock ? mockApi.getHostInfo : realApi.getHostInfo;

export const submitHostEvaluation = isMock
  ? mockApi.submitHostEvaluation
  : realApi.submitHostEvaluation;
