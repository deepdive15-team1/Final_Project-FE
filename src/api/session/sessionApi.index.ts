/**
 * 세션 API. VITE_USE_MOCK=true 이면 mock, 아니면 실제 API 사용.
 */

/* eslint-disable @typescript-eslint/no-unused-vars -- JSDoc @param/@returns 타입 참조용 */
import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "../../types/api/session";
/* eslint-enable @typescript-eslint/no-unused-vars */

import { createSession as realCreateSession } from "./sessionApi";
import { createSession as mockCreateSession } from "./sessionApi.mock";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 러닝 세션 개설.
 * @param {CreateSessionRequest} requestBody - 세션 개설 요청 본문
 * @returns {Promise<CreateSessionResponse>} 생성된 세션 정보
 */
export const createSession = isMock ? mockCreateSession : realCreateSession;
