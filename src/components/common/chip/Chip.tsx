import { forwardRef } from "react";
import styled, { css } from "styled-components";

export type ChipVariant = keyof typeof VARIANTS;
export type ChipSize = keyof typeof SIZES;
export type ChipColor = keyof typeof colorMap;

const VARIANTS = { filled: "filled", outlined: "outlined" } as const;

const SIZES = {
  small: css`
    font-size: 12px;
    height: 24px;
  `,
  medium: css`
    font-size: 13px;
    height: 32px;
  `,
} as const;

const colorMap = {
  default: {
    bg: "var(--color-gray-200)",
    text: "var(--color-gray-600)",
    border: "var(--color-gray-400)",
    hoverBg: "var(--color-gray-400)",
  },
  primary: {
    bg: "var(--color-main)",
    text: "var(--color-white)",
    border: "var(--color-main)",
    hoverBg: "#1a5fcc",
  },
  secondary: {
    bg: "var(--color-main-light)",
    text: "var(--color-main)",
    border: "var(--color-main)",
    hoverBg: "#3d4a5c",
  },
  error: {
    bg: "#dc2626",
    text: "var(--color-white)",
    border: "#dc2626",
    hoverBg: "#b91c1c",
  },
  info: {
    bg: "var(--color-white)",
    text: "var(--color-gray-600)",
    border: "var(--color-gray-400)",
    hoverBg: "#0284c7",
  },
  success: {
    bg: "#22c55e",
    text: "var(--color-white)",
    border: "#22c55e",
    hoverBg: "#16a34a",
  },
  warning: {
    bg: "#f59e0b",
    text: "var(--color-white)",
    border: "#f59e0b",
    hoverBg: "#d97706",
  },
  green: {
    bg: "var(--color-green-light)",
    text: "var(--color-green)",
    border: "var(--color-green)",
    hoverBg: "#00b44b",
  },
  yellow: {
    bg: "var(--color-yellow-light)",
    text: "var(--color-yellow)",
    border: "var(--color-yellow)",
    hoverBg: "#d97706",
  },
  red: {
    bg: "var(--color-red-light)",
    text: "var(--color-red)",
    border: "var(--color-red)",
    hoverBg: "#ff4444",
  },
} as const;

const DEFAULT_PROPS = {
  variant: VARIANTS.filled,
  size: "medium",
  color: "default",
  disabled: false,
} as const satisfies {
  variant: ChipVariant;
  size: ChipSize;
  color: ChipColor;
  disabled: boolean;
};

const LABEL_PADDING: Record<ChipSize, Record<ChipVariant, number>> = {
  small: { [VARIANTS.outlined]: 7, [VARIANTS.filled]: 8 },
  medium: { [VARIANTS.outlined]: 11, [VARIANTS.filled]: 12 },
};

const DELETE_ICON_SIZES: Record<
  ChipSize,
  { marginRight: number; fontSize: number }
> = {
  small: { marginRight: 3, fontSize: 16 },
  medium: { marginRight: 5, fontSize: 20 },
};

const ICON_WRAPPER_SIZES: Record<
  ChipSize,
  { marginLeft: number; marginRight: number; fontSize: number }
> = {
  small: { marginLeft: 7, marginRight: -4, fontSize: 16 },
  medium: { marginLeft: 8, marginRight: -6, fontSize: 18 },
};

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  color?: ChipColor;
  clickable?: boolean;
  disabled?: boolean;
  icon?: React.ReactElement;
  onDelete?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  deleteIcon?: React.ReactElement;
}

const DefaultDeleteIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

function isDeleteKey(key: string) {
  return key === "Backspace" || key === "Delete";
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    label,
    variant = DEFAULT_PROPS.variant,
    size = DEFAULT_PROPS.size,
    color = DEFAULT_PROPS.color,
    clickable,
    disabled = DEFAULT_PROPS.disabled,
    icon,
    onDelete,
    deleteIcon,
    onClick,
    onKeyDown,
    onKeyUp,
    className,
    ...rest
  },
  ref,
) {
  const isClickable = clickable ?? !!onClick;
  const isDeletable = !!onDelete;

  const tabIndex = isClickable || isDeletable ? (disabled ? -1 : 0) : undefined;
  const role = isClickable || isDeletable ? "button" : undefined;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target && isDeleteKey(e.key)) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target && isDeletable && isDeleteKey(e.key)) {
      onDelete?.(e);
    }
    onKeyUp?.(e);
  };

  const deleteIconElement = isDeletable ? (
    <DeleteIconWrapper
      $size={size}
      onClick={handleDeleteClick}
      onMouseDown={(e) => e.stopPropagation()}
      aria-label="삭제"
    >
      {deleteIcon ?? <DefaultDeleteIcon />}
    </DeleteIconWrapper>
  ) : null;

  const iconElement = icon ? (
    <IconWrapper $size={size}>{icon}</IconWrapper>
  ) : null;

  return (
    <StyledRoot
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      className={className}
      $variant={variant}
      $size={size}
      $color={color}
      $clickable={isClickable}
      $deletable={isDeletable}
      $disabled={disabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...rest}
    >
      {iconElement}
      <StyledLabel $size={size} $variant={variant}>
        {label}
      </StyledLabel>
      {deleteIconElement}
    </StyledRoot>
  );
});

Chip.displayName = "Chip";

export default Chip;

const StyledRoot = styled.div<{
  $variant: ChipVariant;
  $size: ChipSize;
  $color: ChipColor;
  $clickable: boolean;
  $deletable: boolean;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  line-height: 1.5;
  max-width: 100%;
  white-space: nowrap;
  border-radius: 16px;
  border: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
  text-decoration: none;
  vertical-align: middle;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  cursor: ${({ $clickable, $disabled }) =>
    $disabled ? "not-allowed" : $clickable ? "pointer" : "default"};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  ${({ $size }) => SIZES[$size]}

  ${({ $variant, $color }) => {
    const c = colorMap[$color];
    if ($variant === VARIANTS.filled) {
      return css`
        background-color: ${c.bg};
        color: ${c.text};
        border: none;
      `;
    }
    return css`
      background-color: transparent;
      color: ${c.border};
      border: 1px solid ${c.border};
    `;
  }}

  ${({ $clickable, $variant, $color }) => {
    if (!$clickable) return css``;
    const c = colorMap[$color];
    return css`
      &:hover {
        background-color: ${$variant === VARIANTS.filled
          ? c.hoverBg
          : `color-mix(in srgb, ${c.bg} 15%, transparent)`};
      }
      &:active {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    `;
  }}
`;

const StyledLabel = styled.span<{ $size: ChipSize; $variant: ChipVariant }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-inline: ${({ $size, $variant }) => LABEL_PADDING[$size][$variant]}px;
`;

const DeleteIconWrapper = styled.span<{ $size: ChipSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: -6px;
  margin-right: ${({ $size }) => DELETE_ICON_SIZES[$size].marginRight}px;
  padding: 2px;
  font-size: ${({ $size }) => DELETE_ICON_SIZES[$size].fontSize}px;
  cursor: pointer;
  opacity: 0.8;
  border-radius: 50%;

  &:hover {
    opacity: 1;
  }
`;

const IconWrapper = styled.span<{ $size: ChipSize }>`
  display: inline-flex;
  margin-left: ${({ $size }) => ICON_WRAPPER_SIZES[$size].marginLeft}px;
  margin-right: ${({ $size }) => ICON_WRAPPER_SIZES[$size].marginRight}px;
  font-size: ${({ $size }) => ICON_WRAPPER_SIZES[$size].fontSize}px;
`;
