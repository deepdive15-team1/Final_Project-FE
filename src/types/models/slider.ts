export type SizeType = "xs" | "sm" | "md" | "lg";

export interface SliderProps {
  label: string;
  valueLabelFormat: (value: number) => string;
  unit?: string;
  name: string;
  className: string;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}
