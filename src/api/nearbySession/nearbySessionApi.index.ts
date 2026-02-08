import { nearbySession as realNearbySession } from "./nearbySessionApi";
import { nearbySession as mockNearbySession } from "./nearbySessionApi.mock";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

export const nearbySession = isMock ? mockNearbySession : realNearbySession;
