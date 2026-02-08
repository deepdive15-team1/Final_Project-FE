// 카카오 로컬 API - 좌표 기준 가까운 POI 장소명 조회
// 로컬 API는 REST API 키만 허용 (JS 키 사용 시 401). env: VITE_KAKAO_REST_API_KEY

import type {
  CategorySearchResponse,
  Coord2AddressResponse,
} from "../../types/api/kakaoLocal";
export type { Coord } from "../../types/api/kakaoLocal";

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as
  | string
  | undefined;
const BASE_URL = "https://dapi.kakao.com";

/**
 * 좌표 기준 반경 내 카테고리 검색 (거리순)
 * - POI가 없으면 coord2address로 주소 반환
 */
async function fetchCategoryNearby(
  lng: number,
  lat: number,
  radius = 200,
  categoryGroupCode = "AT4",
): Promise<CategorySearchResponse> {
  if (!REST_API_KEY)
    throw new Error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
  const url = `${BASE_URL}/v2/local/search/category.json?category_group_code=${categoryGroupCode}&x=${lng}&y=${lat}&radius=${radius}&sort=distance`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });
  if (!res.ok) throw new Error(`카카오 로컬 API 오류: ${res.status}`);
  return res.json();
}

/**
 * 좌표 -> 주소 변환 (POI 없을 때 주소로 대체)
 */
async function fetchCoord2Address(
  lng: number,
  lat: number,
): Promise<Coord2AddressResponse> {
  if (!REST_API_KEY)
    throw new Error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
  const url = `${BASE_URL}/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });
  if (!res.ok) throw new Error(`카카오 로컬 API 오류: ${res.status}`);
  return res.json();
}

const FALLBACK_PLACE_NAME = "선택한 위치";

/**
 * 해당 좌표에서 가장 가까운 POI 장소명 한 개를 반환합니다.
 * - 카테고리 검색(관광명소)으로 인근 장소 조회 후 1건 반환
 * - 결과가 없으면 좌표 -> 주소 변환으로 주소 문자열 반환
 * - REST API 키가 없거나 API 실패 시 "선택한 위치" 반환
 */
export async function getNearbyPlaceName(
  lng: number,
  lat: number,
): Promise<string> {
  if (!REST_API_KEY) return FALLBACK_PLACE_NAME;

  try {
    const category = await fetchCategoryNearby(lng, lat);
    if (category.documents?.length > 0) {
      return category.documents[0].place_name;
    }
  } catch {
    // 카테고리 검색 실패 시 주소로 대체
  }

  try {
    const address = await fetchCoord2Address(lng, lat);
    const doc = address.documents?.[0];
    if (!doc) return FALLBACK_PLACE_NAME;

    const road = doc.road_address;
    if (road?.building_name) return road.building_name;
    if (road?.address_name) return road.address_name;
    if (doc.address?.address_name) return doc.address.address_name;
  } catch {
    // ignore
  }
  return FALLBACK_PLACE_NAME;
}
