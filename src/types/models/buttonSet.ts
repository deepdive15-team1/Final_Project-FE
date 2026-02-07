import type { SizeType } from "../../components/common/button/Styles";

export interface ButtonOption {
  value: string;
  label: string;
}

export interface ButtonSetProps {
  label: string;
  name: string;
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
  size?: SizeType;
  className?: string;
  disabled?: boolean;
}

export interface StepperProps {
  label: string;
  name: string;
  size?: SizeType;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
}
