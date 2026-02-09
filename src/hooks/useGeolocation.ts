import { useState, useEffect, useCallback, useRef } from "react";

interface LocationType {
  x: number | null;
  y: number | null;
}

interface GeolocationResult {
  location: LocationType;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export const useGeolocation = (
  options: PositionOptions = {},
): GeolocationResult => {
  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;
  const [location, setLocation] = useState<LocationType>({
    x: null,
    y: null,
  });
  const [error, setError] = useState<string | null>(
    isSupported
      ? null
      : "사용하시는 브라우저는 위치 정보 기능을 지원하지 않습니다.",
  );
  const [isLoading, setIsLoading] = useState<boolean>(isSupported);

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const getLocation = useCallback(() => {
    if (!isSupported) return;

    const { geolocation } = navigator;

    // 성공 핸들러
    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setLocation({
        x: longitude,
        y: latitude,
      });
      setIsLoading(false);
    };

    // 에러 핸들러
    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
      setIsLoading(false);
    };

    // 실제 요청 수행
    // options는 의존성 배열에서 제외하여 무한 렌더링 방지
    geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      optionsRef.current,
    );
  }, [isSupported]);

  // 마운트 시 최초 1회 실행
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, isLoading, refetch: getLocation };
};
