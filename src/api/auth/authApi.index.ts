/**
 * 인증 API. VITE_USE_MOCK=true 이면 mock, 아니면 실제 API 사용.
 */

/* eslint-disable @typescript-eslint/no-unused-vars -- JSDoc @param/@returns 타입 참조용 */
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../../types/auth";
/* eslint-enable @typescript-eslint/no-unused-vars */

import { login as realLogin, signup as realSignup } from "./authApi";
import { login as mockLogin, signup as mockSignup } from "./authApi.mock";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 회원가입.
 * @param {SignupRequest} requestBody - 회원가입 요청 본문
 * @returns {Promise<SignupResponse>} 생성된 사용자 userId
 */
export const signup = isMock ? mockSignup : realSignup;

/**
 * 로그인.
 * @param {LoginRequest} requestBody - 로그인 요청 본문
 * @returns {Promise<LoginResponse>} 사용자 정보
 */
export const login = isMock ? mockLogin : realLogin;
