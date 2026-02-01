import { forwardRef } from "react";
import styled, { css } from "styled-components";

export interface SelectOptionItem<Value = string | number> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  "value"
> {
  value: string | number;
  disabled?: boolean;
  selected?: boolean;
  "data-value"?: string;
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  (
    {
      value,
      children,
      disabled = false,
      selected,
      "data-value": dataValue,
      ...props
    },
    ref,
  ) => {
    return (
      <OptionRoot
        ref={ref}
        role="option"
        aria-selected={selected ?? false}
        aria-disabled={disabled}
        $selected={selected}
        $disabled={disabled}
        data-value={dataValue ?? value}
        tabIndex={selected ? 0 : -1}
        {...props}
      >
        {children}
      </OptionRoot>
    );
  },
);

SelectOption.displayName = "SelectOption";

export default SelectOption;

const OptionRoot = styled.li<{
  $selected?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  list-style: none;
  outline: none;
  transition: background-color 0.15s;

  &:hover:not([aria-disabled="true"]) {
    background-color: var(--color-gray-100);
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: var(--color-gray-100);
      font-weight: 500;
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      color: var(--color-gray-400);
      cursor: not-allowed;
      pointer-events: none;
    `}
`;
