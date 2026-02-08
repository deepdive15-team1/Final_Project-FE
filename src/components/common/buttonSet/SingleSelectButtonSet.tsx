import { useState } from "react";
import styled from "styled-components";

import type { SingleSelectedButtonSetProps } from "../../../types/models/buttonSet";
import { Button } from "../button/Button";

export default function SingleSelectButtonSet({
  name,
  options,
  label,
  size,
  className,
  disabled = false,
  defaultValue,
}: SingleSelectedButtonSetProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");

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
            onClick={() => setValue(option.value)}
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
  font-weight: 600;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: left;
`;

const ButtonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
