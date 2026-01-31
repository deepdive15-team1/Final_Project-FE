import styled, { css } from "styled-components";

export type VariantType = keyof typeof VARIANTS;
export type SizeType = keyof typeof SIZES;

interface WrapperProps {
  $fullWidth: boolean;
}

interface InputContainerProps {
  $variant: VariantType;
  $size: SizeType;
  $hasError?: boolean;
  $disabled?: boolean;
}

interface MessageProps {
  $isError?: boolean;
}

const VARIANTS = {
  primary: css`
    background-color: var(--color-white);
    color: var(--color-text);
    border: 1px solid var(--color-gray-200);
  `,
  neutral: css`
    background-color: var(--color-gray-100);
    color: var(--color-text);
    border: 1px solid var(--color-gray-200);
  `,
};

const SIZES = {
  sm: css`
    font-size: 12px;
    height: 40px;
    padding: 0 12px;
  `,
  md: css`
    font-size: 14px;
    height: 44px;
    padding: 0 14px;
  `,
  lg: css`
    font-size: 16px;
    height: 52px;
    padding: 0 16px;
  `,
};

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);

  display: block;
  width: 100%;
  text-align: left;
`;

export const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  color: var(--color-text);

  ${({ $size }) => SIZES[$size]}
  ${({ $variant }) => VARIANTS[$variant]}
  
  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: #ff4d4f !important;
      &:focus-within {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    `}
    
  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: var(--color-gray-100);
      cursor: not-allowed;
      opacity: 1;
      color: var(--color-gray-400);
      pointer-events: none;
    `}
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Message = styled.span<MessageProps>`
  font-size: 12px;
  color: ${({ $isError }) => ($isError ? "#ff4d4f" : "var(--color-text)")};
  margin-top: 4px;
  margin-left: 4px;
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  min-width: 0;
  font-family: inherit;
  color: inherit;
  font-size: inherit;
  border-radius: 10px;

  &::placeholder {
    color: var(--color-gray-600);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
