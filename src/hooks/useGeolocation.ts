import { useState, useEffect } from "react";

interface LocationType {
  x: number | null;
  y: number | null;
}

interface GeolocationResult {
  location: LocationType;
  error: string | null;
  isLoading: boolean;
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

  // 성공 핸들러: 'GeolocationPosition' 타입 사용
  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      x: longitude, // x = 경도
      y: latitude, // y = 위도
    });
    setIsLoading(false);
  };
  // 에러 핸들러: 'GeolocationPositionError' 타입 사용
  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isSupported) return;

    const { geolocation } = navigator;

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options, isSupported]);

  return { location, error, isLoading };
};
