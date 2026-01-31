import { useId, forwardRef, useRef, useImperativeHandle } from "react";
import {
  Wrapper,
  Label,
  InputContainer,
  IconWrapper,
  Message,
  StyledInput,
} from "./Styles";
import type { VariantType, SizeType } from "./Styles";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: VariantType;
  size?: SizeType;
  fullWidth?: boolean;
  errorMessage?: string;
  label?: string;
  /**
   * 인풋 내부 앞쪽에 위치할 아이콘입니다.
   * - 이미지 경로(string)를 직접 넣지 마세요.
   * - `<img src="..." />` 태그나 SVG 컴포넌트(`<Icon />`) 형태로 전달해야 합니다.
   *
   * @example
   * startIcon={<img src="/icons/search.svg" alt="search" />}
   * startIcon={<SearchIcon />}
   */
  startIcon?: React.ReactNode;

  /**
   * 인풋 내부 뒤쪽에 위치할 아이콘입니다.
   * - 이미지 경로(string)를 직접 넣지 마세요.
   * - `<img src="..." />` 태그나 SVG 컴포넌트(`<Icon />`) 형태로 전달해야 합니다.
   *
   * @example
   * endIcon={<img src="/icons/eye.svg" alt="eye" />}
   * endIcon={<EyeIcon />}
   */
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      errorMessage,
      variant = "primary",
      size = "md",
      fullWidth = true,
      startIcon,
      endIcon,
      className,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const inputId = props.id || uniqueId;

    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const handleContainerClick = () => {
      if (props.disabled) return;
      // 외부에서 ref를 안 줘도, 내부 innerRef로 포커스 가능
      innerRef.current?.focus();
    };

    return (
      <Wrapper $fullWidth={fullWidth} className={className}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        <InputContainer
          $variant={variant}
          $size={size}
          $hasError={!!errorMessage}
          $disabled={props.disabled}
          onClick={handleContainerClick}
        >
          {startIcon && <IconWrapper>{startIcon}</IconWrapper>}

          <StyledInput
            ref={innerRef}
            id={inputId}
            type={type}
            disabled={props.disabled}
            {...props}
          />

          {endIcon && <IconWrapper>{endIcon}</IconWrapper>}
        </InputContainer>

        {errorMessage && <Message $isError={true}>{errorMessage}</Message>}
      </Wrapper>
    );
  },
);

Input.displayName = "Input";
