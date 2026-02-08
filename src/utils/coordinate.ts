export function formatCoordinate(value: number | null): string {
  if (value == null) return "-";
  return Number(value).toFixed(4);
}

/** 좌표 값을 소수점 4자리로 반올림 (백엔드 전송 시 사용, formatCoordinate와 동일 자릿수) */
export function roundCoordinate(value: number): number {
  return Number(Number(value).toFixed(4));
}

/** 위경도 한 점 */
export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

// 두 위경도 점 사이 거리(km) — Haversine 공식
function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return EARTH_RADIUS_KM * c;
}

// 좌표 배열에서 연속된 점 사이 거리를 모두 합산해 총 거리(km)를 반환합니다.
export function getPathLengthKm(points: LatLng[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distanceKm(points[i - 1], points[i]);
  }
  return total;
}
