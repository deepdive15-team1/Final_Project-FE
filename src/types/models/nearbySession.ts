export interface NearbySessionRequest {
  x: number;
  y: number;
}

export interface NearbySessionResponse {
  id: number;
  title: string;
  applicants: number;
  maxCapacity: number;
  locationName: string;
  distanceFromPositionKm: number;
  targetDistanceKm: number;
  avgPaceSec: number;
  startAt: string;
}

export interface NearbyItemProps {
  session: NearbySessionResponse;
  onClick?: () => void;
}
