import type { SizeType } from "../../components/common/button/Styles";

export interface ButtonOption {
  value: string;
  label: string;
}

export interface ButtonSetProps<T = unknown> {
  label: string;
  name: string;
  size?: SizeType;
  className?: string;
  disabled?: boolean;
  defaultValue?: T;
}

export interface SingleSelectedButtonSetProps extends ButtonSetProps<string> {
  options: ButtonOption[];
}

export interface StepperProps extends ButtonSetProps<number> {
  min?: number;
  max?: number;
}
