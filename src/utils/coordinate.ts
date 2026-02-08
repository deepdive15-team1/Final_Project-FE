export function formatCoordinate(value: number | null): string {
  if (value == null) return "-";
  return Number(value).toFixed(4);
}
