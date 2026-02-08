import type {
  NearbySessionRequest,
  NearbySessionResponse,
} from "../../types/api/nearbySession";
import { axiosInstance } from "../axiosInstance";

export const nearbySession = async (
  requestBody: NearbySessionRequest,
): Promise<NearbySessionResponse[]> => {
  const response = await axiosInstance.get<NearbySessionResponse[]>(
    "/sessions/search/nearby",
    { params: requestBody },
  );
  return response.data;
};
