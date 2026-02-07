import { useState } from "react";
import styled from "styled-components";

import type { SliderProps } from "../../../types/models/slider";

export default function Slider({
  label,
  valueLabelFormat,
  unit,
  name,
  className,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
}: SliderProps) {
  const [value, setValue] = useState(() =>
    Math.max(min, Math.min(max, defaultValue ?? min)),
  );

  const valueLabel = valueLabelFormat(value);
  const valueLabelWithUnit = unit ? `${valueLabel} ${unit}` : valueLabel;

  return (
    <Wrapper className={className}>
      <LabelWrapper>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Value>{valueLabelWithUnit}</Value>
      </LabelWrapper>
      <input
        id={name}
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        disabled={disabled}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: left;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: right;
`;
