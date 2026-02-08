/** 좌표 (경도, 위도) */
export interface Coord {
  lng: number;
  lat: number;
}

/** 좌표 -> 주변 장소명 검색 응답 문서서 */
export interface CategoryDocument {
  place_name: string;
  distance: string;
  x: string;
  y: string;
  [key: string]: unknown;
}

export interface CategorySearchResponse {
  documents: CategoryDocument[];
  meta: { total_count: number };
}

/** 좌표 -> 주소 응답 문서 (POI 없을 때 주소로 대체) */
export interface Coord2AddressDocument {
  address?: { address_name: string };
  road_address?: { address_name: string; building_name?: string };
}

export interface Coord2AddressResponse {
  documents: Coord2AddressDocument[];
}
