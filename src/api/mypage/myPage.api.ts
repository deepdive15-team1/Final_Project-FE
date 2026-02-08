import type {
  UserInfoResponse,
  CreatedRunningResponse,
  AppliedRunningResponse,
  RecentRunningResponse,
} from "../../types/api/myPage";
import { axiosInstance } from "../axiosInstance";

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const { data } = await axiosInstance.get<UserInfoResponse>("/users/me");
  return data;
};

export const getCreatedRuns = async (): Promise<CreatedRunningResponse> => {
  const { data } = await axiosInstance.get<CreatedRunningResponse>(
    "/users/me/runnings/mySession",
    { params: { limit: 3 } },
  );
  return data;
};

export const getAppliedRuns = async (): Promise<AppliedRunningResponse> => {
  const { data } = await axiosInstance.get<AppliedRunningResponse>(
    "/users/me/runnings/applied",
    { params: { limit: 3 } },
  );
  return data;
};

export const getRecentRuns = async (): Promise<RecentRunningResponse> => {
  const { data } = await axiosInstance.get<RecentRunningResponse>(
    "/users/me/runnings/recent",
    { params: { limit: 3 } },
  );
  return data;
};
