import styled from "styled-components";

import type { ButtonSetProps } from "../../../types/models/buttonSet";
import { Button } from "../button/Button";

export default function SingleSelectButtonSet({
  name,
  options,
  value,
  onChange,
  label,
  size,
  className,
  disabled = false,
}: ButtonSetProps) {
  return (
    <Wrapper className={className} role="group" aria-label={name}>
      {label && <Label>{label}</Label>}
      <input type="hidden" name={name} value={value} readOnly aria-hidden />
      <ButtonList>
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            size={size}
            rounded
            isSelected={option.value === value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </ButtonList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: left;
`;

const ButtonList = styled.div`
  display: flex;
  gap: 8px;
`;
