import {
  useId,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";
import styled, { css } from "styled-components";

export type VariantType = keyof typeof VARIANTS;
export type SizeType = keyof typeof SIZES;

/** 기본값: 여기만 수정 */
const DEFAULT_PROPS = {
  variant: "primary",
  size: "md",
  fullWidth: true,
  error: false,
  readOnly: false,
} as const satisfies {
  variant: VariantType;
  size: SizeType;
  fullWidth: boolean;
  error: boolean;
  readOnly: boolean;
};

const VARIANTS = {
  primary: css`
    background-color: var(--color-gray-100);
    color: var(--color-text);
    border: none;
  `,
  secondary: css`
    background-color: var(--color-white);
    color: var(--color-text);
    border: 1px solid var(--color-gray-200);
  `,
};

const SIZES = {
  sm: css`
    font-size: 12px;
    min-height: 80px;
    padding: 10px 12px;
  `,
  md: css`
    font-size: 14px;
    min-height: 100px;
    padding: 12px 14px;
  `,
  lg: css`
    font-size: 16px;
    min-height: 120px;
    padding: 14px 16px;
  `,
} as const;

/** 에러/포커스 링·메시지 색상 한곳에서 관리 */
const stateColorMap = {
  error: {
    border: "#ff4d4f",
    focusRing: "rgba(239, 68, 68, 0.1)",
    message: "#ff4d4f",
  },
} as const;

export interface TextFieldProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  variant?: VariantType;
  size?: SizeType;
  fullWidth?: boolean;
  error?: boolean; // true면 라벨·helper·테두리가 빨간색(에러 스타일)
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  minRows?: number;
  maxRows?: number;
  inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  readOnly?: boolean;
}

export const TextField = forwardRef<HTMLTextAreaElement, TextFieldProps>(
  (
    {
      label,
      error = DEFAULT_PROPS.error,
      helperText,
      variant = DEFAULT_PROPS.variant,
      size = DEFAULT_PROPS.size,
      fullWidth = DEFAULT_PROPS.fullWidth,
      minRows,
      maxRows,
      rows,
      className,
      id: idOverride,
      inputProps,
      readOnly = DEFAULT_PROPS.readOnly,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const inputId = idOverride || uniqueId;
    const helperTextId =
      helperText && inputId ? `${inputId}-helper-text` : undefined;

    const innerRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const handleContainerClick = () => {
      if (props.disabled || readOnly) return;
      innerRef.current?.focus();
    };

    const rowsToShow = rows ?? minRows;

    /** maxRows 있을 때 입력에 따라 높이를 minRows~maxRows 범위로 자동 조절 */
    const syncHeight = useCallback(() => {
      const el = innerRef.current;
      if (!el || maxRows == null) return;

      const style = getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize) || 14;
      const lineHeightPx =
        style.lineHeight === "normal"
          ? fontSize * 1.5
          : parseFloat(style.lineHeight) || fontSize * 1.5;
      const verticalExtra = [
        style.paddingTop,
        style.paddingBottom,
        style.borderTopWidth,
        style.borderBottomWidth,
      ].reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

      const minRowsCount = minRows ?? rows ?? 1;
      const minH = minRowsCount * lineHeightPx + verticalExtra;
      const maxH = maxRows * lineHeightPx + verticalExtra;

      el.style.overflow = "hidden";
      el.style.height = "0";
      const scrollH = el.scrollHeight;
      el.style.height = `${Math.min(maxH, Math.max(minH, scrollH))}px`;
      el.style.overflow = "";
    }, [maxRows, minRows, rows]);

    useEffect(() => {
      syncHeight();
    }, [syncHeight, props.value]);

    return (
      <Wrapper $fullWidth={fullWidth} className={className}>
        {label != null && label !== "" && (
          <Label htmlFor={inputId}>{label}</Label>
        )}

        <TextFieldContainer
          $variant={variant}
          $size={size}
          $rowsToShow={rowsToShow}
          $maxRows={maxRows}
          $hasError={error}
          $disabled={props.disabled}
          $readOnly={readOnly}
          onClick={handleContainerClick}
        >
          <StyledTextField
            {...inputProps}
            {...props}
            ref={innerRef}
            id={inputId}
            rows={rows ?? minRows}
            $maxRows={maxRows}
            $readOnly={readOnly}
            readOnly={readOnly}
            disabled={props.disabled}
            aria-invalid={error}
            aria-readonly={readOnly}
            aria-describedby={helperTextId}
            onInput={(e) => {
              props.onInput?.(e);
              inputProps?.onInput?.(e);
              syncHeight();
            }}
          />
        </TextFieldContainer>

        {helperText && (
          <Message id={helperTextId} $isError={error}>
            {helperText}
          </Message>
        )}
      </Wrapper>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: left;
`;

const TextFieldContainer = styled.div<{
  $variant: VariantType;
  $size: SizeType;
  $rowsToShow?: number;
  $maxRows?: number;
  $hasError?: boolean;
  $disabled?: boolean;
  $readOnly?: boolean;
}>`
  display: flex;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  color: var(--color-text);

  ${({ $size }) => SIZES[$size]}
  ${({ $variant }) => VARIANTS[$variant]}

  ${({ $readOnly }) =>
    $readOnly &&
    css`
      cursor: default;
    `}

  ${({ $rowsToShow, $maxRows }) =>
    $rowsToShow != null &&
    css`
      min-height: 0;
      min-height: calc(1.5em * ${$rowsToShow});
      ${$maxRows == null ? `height: calc(1.5em * ${$rowsToShow});` : ""}
    `}

  ${({ $maxRows }) =>
    $maxRows != null &&
    css`
      min-height: 0;
      max-height: calc(1.5em * ${$maxRows});
    `}

  ${({ $hasError }) =>
    $hasError &&
    css`
      border: 1px solid ${stateColorMap.error.border} !important;
      &:focus-within {
        box-shadow: 0 0 0 3px ${stateColorMap.error.focusRing};
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

const Message = styled.span<{ $isError?: boolean }>`
  font-size: 12px;
  color: ${({ $isError }) =>
    $isError ? stateColorMap.error.message : "var(--color-text)"};
  margin-top: 4px;
  margin-left: 4px;
`;

const StyledTextField = styled.textarea<{
  $maxRows?: number;
  $readOnly?: boolean;
}>`
  flex: 1;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  min-width: 0;
  min-height: inherit;
  font-family: inherit;
  color: inherit;
  font-size: inherit;
  line-height: 1.5;
  border-radius: 10px;
  resize: none;

  ${({ $readOnly }) =>
    $readOnly &&
    css`
      cursor: text;
      user-select: text;
    `}

  ${({ $maxRows }) =>
    $maxRows != null &&
    css`
      max-height: calc(1.5em * ${$maxRows});
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    `}

  &::placeholder {
    color: var(--color-gray-600);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
