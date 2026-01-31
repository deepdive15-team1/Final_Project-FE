import { IconWrapper, StyledButton } from "./Styles";
import type { VariantType, SizeType } from "./Styles";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  size?: SizeType;
  type?: "button" | "submit";
  fullWidth?: boolean;
  iconOnly?: boolean;
  rounded?: boolean;
  isSelected?: boolean;
  /**
   * 버튼 앞쪽에 위치할 아이콘입니다.
   * - 이미지 경로(string)를 직접 넣지 마세요.
   * - `<img src="..." />` 태그나 SVG 컴포넌트(`<Icon />`) 형태로 전달해야 합니다.
   * * @example
   * startIcon={<img src="/icons/star.svg" alt="star" />}
   * startIcon={<StarIcon />}
   */
  startIcon?: React.ReactNode; // img도 가능하고 컴포넌트도 가능

  /**
   * 버튼 뒤쪽에 위치할 아이콘입니다.
   * - 이미지 경로(string)를 직접 넣지 마세요.
   * - `<img src="..." />` 태그나 SVG 컴포넌트(`<Icon />`) 형태로 전달해야 합니다.
   *
   * @example
   * endIcon={<img src="/icons/arrow.svg" alt="arrow" />}
   * endIcon={<ArrowIcon />}
   */
  endIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      type = "button",
      fullWidth = false,
      iconOnly = false,
      rounded = false,
      isSelected = false,
      onClick,
      children,
      disabled,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $iconOnly={iconOnly}
        $rounded={rounded}
        $isSelected={isSelected}
        type={type}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {/* 아이콘이 텍스트 앞에 있을 때 */}
        {startIcon && <IconWrapper>{startIcon}</IconWrapper>}
        <span className="button-text">{children}</span>
        {/* 아이콘이 텍스트 뒤에 있을 때 */}
        {endIcon && <IconWrapper>{endIcon}</IconWrapper>}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";
