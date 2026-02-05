import { createSession as realCreateSession } from "./sessionApi";
import { createSession as mockCreateSession } from "./sessionApi.mock";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

export const createSession = isMock ? mockCreateSession : realCreateSession;
