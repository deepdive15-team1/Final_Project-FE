import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "../../types/api/session";
import { axiosInstance } from "../axiosInstance";

export const createSession = async (
  requestBody: CreateSessionRequest,
): Promise<CreateSessionResponse> => {
  const response = await axiosInstance.post<CreateSessionResponse>(
    "/sessions",
    requestBody,
  );
  return response.data;
};
