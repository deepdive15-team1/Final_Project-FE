import { useState } from "react";
import styled from "styled-components";

import MinusIcon from "../../../assets/icon/minus.svg?react";
import PlusIcon from "../../../assets/icon/plus.svg?react";
import type { StepperProps } from "../../../types/models/buttonSet";
import { Button } from "../button/Button";

export default function Stepper({
  name,
  label,
  size,
  className,
  disabled = false,
  min = 0,
  max = 100,
  defaultValue = 0,
}: StepperProps) {
  const [value, setValue] = useState(() =>
    Math.max(min, Math.min(max, defaultValue ?? min)),
  );

  return (
    <Wrapper className={className} role="group" aria-label={name}>
      {label && <Label>{label}</Label>}

      <StepperWrapper>
        <Button
          key={className + "left"}
          variant="outline"
          type="button"
          size={size}
          disabled={disabled || value <= min}
          onClick={() => setValue((prev) => Math.max(min, prev - 1))}
          iconOnly
        >
          <MinusIcon />
        </Button>

        <input name={name} value={value} readOnly aria-hidden />

        <Button
          key={className + "right"}
          variant="outline"
          type="button"
          size={size}
          disabled={disabled || value >= max}
          onClick={() => setValue((prev) => Math.min(max, prev + 1))}
          iconOnly
        >
          <PlusIcon style={{ color: "var(--color-text)" }} />
        </Button>
      </StepperWrapper>
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

const StepperWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;

  input {
    width: 60px;
    height: 28px;
    border: none;
    text-align: center;
    font-size: 18px;
  }
`;
