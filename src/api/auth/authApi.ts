import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../../types/auth";
import { axiosInstance } from "../axiosInstance";

export const signup = async (
  requestBody: SignupRequest,
): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>(
    "/auth/signup",
    requestBody,
  );
  return response.data;
};

export const login = async (
  requestBody: LoginRequest,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    requestBody,
  );
  return response.data;
};
