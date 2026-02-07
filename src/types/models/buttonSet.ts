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
