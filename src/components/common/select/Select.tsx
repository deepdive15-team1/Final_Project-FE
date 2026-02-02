import { forwardRef, useCallback, useId } from "react";
import styled, { css } from "styled-components";

import SelectInput from "./SelectInput";
import type { SelectInputProps, SelectChangeEvent } from "./SelectInput";
import SelectOption from "./SelectOption";
import type { SelectOptionItem } from "./SelectOption";

export type { SelectChangeEvent };

export type SelectVariantType = keyof typeof VARIANTS;
export type SelectSizeType = keyof typeof SIZES;

/** 기본값: 여기만 수정 */
const DEFAULT_PROPS = {
  variant: "primary",
  size: "md",
  fullWidth: true,
  error: false,
} as const satisfies {
  variant: SelectVariantType;
  size: SelectSizeType;
  fullWidth: boolean;
  error: boolean;
};

const VARIANTS = {
  primary: css`
    background-color: var(--color-white);
    color: var(--color-text);
    border: 1px solid var(--color-gray-200);
  `,
  secondary: css`
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
} as const;

const stateColorMap = {
  error: {
    border: "#ff4d4f",
    focusRing: "rgba(239, 68, 68, 0.1)",
    message: "#ff4d4f",
  },
} as const;

export interface SelectProps<Value = unknown> extends Omit<
  SelectInputProps<Value>,
  "variant" | "error" | "inputRef" | "inputProps" | "children"
> {
  variant?: SelectVariantType;
  size?: SelectSizeType;
  fullWidth?: boolean;
  error?: boolean;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  id?: string;
  inputRef?: SelectInputProps<Value>["inputRef"];
  inputProps?: Record<string, unknown>;
  options: SelectOptionItem<Value>[];
}

function DefaultSelectIcon(
  props: React.SVGAttributes<SVGSVGElement> & { $open?: boolean },
) {
  const { $open, ...rest } = props;
  void $open;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, color: "var(--color-gray-600)" }}
      {...rest}
    >
      <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
    </svg>
  );
}

export const Select = forwardRef<
  HTMLInputElement | { node: HTMLInputElement; value: unknown },
  SelectProps<unknown>
>(function SelectInner<Value = unknown>(
  props: SelectProps<Value>,
  ref: React.Ref<HTMLInputElement | { node: HTMLInputElement; value: Value }>,
) {
  const {
    label,
    helperText,
    error = DEFAULT_PROPS.error,
    variant = DEFAULT_PROPS.variant,
    size = DEFAULT_PROPS.size,
    fullWidth = DEFAULT_PROPS.fullWidth,
    id: idOverride,
    options,
    inputRef: inputRefProp,
    inputProps = {},
    className,
    ...rest
  } = props;

  const uniqueId = useId();
  const inputId = idOverride ?? uniqueId;
  const helperTextId =
    helperText && inputId ? `${inputId}-helper-text` : undefined;
  const labelId = label && inputId ? `${inputId}-label` : undefined;
  const hasLabel = label != null && label !== "";

  const handleInputRef = useCallback(
    (
      node: HTMLInputElement | { node: HTMLInputElement; value: Value } | null,
    ) => {
      if (typeof inputRefProp === "function") {
        inputRefProp(
          node as HTMLInputElement & { node: HTMLInputElement; value: Value },
        );
      } else if (inputRefProp && typeof inputRefProp === "object") {
        const refObj = inputRefProp as React.MutableRefObject<typeof node>;
        // ref.current 할당은 React ref 전달 관례
        // eslint-disable-next-line react-hooks/immutability
        refObj.current = node;
      }
    },
    [inputRefProp],
  );

  const resolvedChildren = options.map((opt) => (
    <SelectOption
      key={String(opt.value)}
      value={opt.value as string | number}
      disabled={opt.disabled}
    >
      {opt.label}
    </SelectOption>
  ));

  return (
    <Wrapper $fullWidth={fullWidth} className={className}>
      {hasLabel && (
        <Label id={labelId} htmlFor={inputId}>
          {label}
        </Label>
      )}

      <SelectRoot
        $variant={variant}
        $size={size}
        $hasError={error}
        $disabled={props.disabled}
      >
        <SelectInput<Value>
          ref={
            ref as React.Ref<
              HTMLInputElement | { node: HTMLInputElement; value: Value }
            >
          }
          {...rest}
          {...inputProps}
          name={props.name ?? inputId}
          id={inputId}
          labelId={labelId}
          error={error}
          aria-describedby={helperTextId}
          inputRef={handleInputRef}
          IconComponent={props.IconComponent ?? DefaultSelectIcon}
          variant="outlined"
        >
          {resolvedChildren}
        </SelectInput>
      </SelectRoot>

      {helperText != null && helperText !== "" && (
        <Message id={helperTextId} $isError={error}>
          {helperText}
        </Message>
      )}
    </Wrapper>
  );
}) as <Value = unknown>(
  props: SelectProps<Value> & {
    ref?: React.Ref<
      HTMLInputElement | { node: HTMLInputElement; value: Value }
    >;
  },
) => React.ReactElement;

(Select as unknown as { displayName?: string }).displayName = "Select";

export default Select;

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

const SelectRoot = styled.div<{
  $variant: SelectVariantType;
  $size: SelectSizeType;
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  color: var(--color-text);
  position: relative;

  ${({ $size }) => SIZES[$size]}
  ${({ $variant }) => VARIANTS[$variant]}

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: ${stateColorMap.error.border} !important;
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
