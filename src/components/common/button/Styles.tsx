import styled, { css } from "styled-components";

export type VariantType = keyof typeof VARIANTS;
export type SizeType = keyof typeof SIZES;

interface BaseStyleProps {
  $fullWidth: boolean;
  $iconOnly: boolean;
  $rounded: boolean;
  $isSelected?: boolean;
}

interface StyledButtonProps extends BaseStyleProps {
  $variant: VariantType;
  $size: SizeType;
}

const VARIANTS = {
  //메인 버튼
  primary: css`
    background-color: var(--color-main);
    color: var(--color-white);
    border: 1px solid transparent;
  `,
  // 테두리만 있는 버튼
  outline: css`
    background-color: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-gray-200);
  `,
  // 테두리만 있고 테두리 색과 글씨가 메인 색
  outlinePrimary: css`
    background-color: transparent;
    color: var(--color-main);
    border: 1px solid var(--color-main);

    &:hover {
      background-color: var(--color-main-light);
    }
  `,
  //중립 버튼(거절, 별로예요 등)
  neutral: css`
    background-color: var(--color-gray-100);
    color: var(--color-text);
    border: 1px solid transparent;

    &:hover {
      background-color: var(--color-gray-400);
      border-color: transparent;
    }
  `,
  // 텍스트만 있는 버튼
  text: css`
    background-color: transparent;
    color: var(--color-gray-400);
    border: 1px solid transparent;

    &:hover {
      color: var(--color-text);
      background-color: transparent;
      border-color: transparent;
    }
  `,
  //텍스트만 있고 텍스트 색이 메인 색
  textPrimary: css`
    background-color: transparent;
    color: var(--color-main);
    border: 1px solid transparent;

    &:hover {
      opacity: 0.7;
      background-color: transparent;
      border-color: transparent;
    }
  `,
};

const SIZES = {
  xs: css<BaseStyleProps>`
    font-size: 12px;
    height: 36px;
    padding: 0 10px;
    border-radius: 10px;

    /* 아이콘 전용일 때는 정사각형 */
    ${({ $iconOnly }) =>
      $iconOnly &&
      css`
        width: 36px;
        border-radius: 10px;
        padding: 0;
      `}
  `,
  sm: css<BaseStyleProps>`
    font-size: 14px;
    height: 40px;
    border-radius: 10px;
    padding: 9px 14px;

    /* 아이콘 전용일 때는 정사각형 */
    ${({ $iconOnly }) =>
      $iconOnly &&
      css`
        width: 40px;
        border-radius: 10px;
        padding: 0;
      `}
  `,
  md: css<BaseStyleProps>`
    font-size: 14px;
    height: 46px;
    border-radius: 14px;
    padding: 13px 43px;

    /* 아이콘 전용일 때는 정사각형 */
    ${({ $iconOnly }) =>
      $iconOnly &&
      css`
        width: 46px;
        border-radius: 14px;
        padding: 0;
      `}
  `,
  lg: css<BaseStyleProps>`
    font-size: 16px;
    height: 56px;
    padding: 16px;
    border-radius: 12px;

    /* 아이콘 전용일 때는 정사각형 */
    ${({ $iconOnly }) =>
      $iconOnly &&
      css`
        width: 56px;
        border-radius: 12px;
        padding: 0;
      `}
  `,
  xl: css<BaseStyleProps>`
    font-size: 20px;
    height: 96px;
    padding: 24px;
    border-radius: 16px;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
    /* 아이콘 전용일 때는 정사각형 */
    ${({ $iconOnly }) =>
      $iconOnly &&
      css`
        width: 96px;
        border-radius: 16px;
        padding: 0;
      `}
  `,
};

export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  outline: none;
  font-weight: 600;

  .button-text {
    padding: 0 6px;
    line-height: 1;
  }

  ${({ $iconOnly }) =>
    $iconOnly &&
    css`
      padding: 0;

      .button-text {
        padding: 0;
        display: flex;
      }
    `}

  ${({ $variant }) => VARIANTS[$variant]}
  ${({ $size }) => SIZES[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
      display: flex;
    `}

  ${({ $rounded }) =>
    $rounded &&
    css`
      border-radius: 9999px;
    `}

    ${({ $isSelected }) =>
    $isSelected &&
    css`
      border-color: var(--color-main);
      color: var(--color-main);
      background-color: transparent;
      font-weight: 700;
    `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    border-color: transparent;
    pointer-events: none;
  }
`;
