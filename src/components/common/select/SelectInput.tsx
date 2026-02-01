import * as React from "react";
import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  useEffect,
  useId,
} from "react";
import styled, { css } from "styled-components";
import Menu from "./Menu";

export type SelectChangeEvent<Value = unknown> =
  | React.ChangeEvent<HTMLInputElement>
  | (Event & { target: { value: Value; name: string } });

export interface SelectInputProps<Value = unknown> {
  "aria-describedby"?: string;
  "aria-label"?: string;
  autoFocus?: boolean;
  autoWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: Value;
  disabled?: boolean;
  displayEmpty?: boolean;
  error?: boolean;
  IconComponent?: React.ElementType;
  inputRef?: React.Ref<
    HTMLInputElement | { node: HTMLInputElement; value: Value }
  >;
  labelId?: string;
  MenuProps?: {
    PaperProps?: { style?: React.CSSProperties };
    [key: string]: unknown;
  };
  name?: string;
  onBlur?: React.FocusEventHandler;
  onChange?: (
    event: SelectChangeEvent<Value>,
    child?: React.ReactElement,
  ) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  onFocus?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onOpen?: (event: React.SyntheticEvent) => void;
  open?: boolean;
  readOnly?: boolean;
  renderValue?: (value: Value) => React.ReactNode;
  required?: boolean;
  SelectDisplayProps?: React.HTMLAttributes<HTMLDivElement>;
  tabIndex?: number;
  value?: Value;
  variant?: "standard" | "outlined" | "filled";
  id?: string;
  placeholder?: React.ReactNode;
}

/** value를 가진 옵션 자식 엘리먼트 타입 */
type OptionChildElement = React.ReactElement<{
  value: unknown;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
}>;

function useControlled<T>(props: {
  controlled: T | undefined;
  default: T | undefined;
  name: string;
}): [T, (v: T) => void] {
  const { controlled, default: defaultProp } = props;
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultProp,
  );
  const isControlled = controlled !== undefined;
  const value = (isControlled ? controlled : internalValue) as T;

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) setInternalValue(newValue);
    },
    [isControlled],
  );

  return [value, setValue];
}

/** 값 비교 (객체는 참조, 그 외는 문자열 비교) */
function areEqualValues(a: unknown, b: unknown): boolean {
  if (typeof b === "object" && b !== null) return a === b;
  return String(a) === String(b);
}

function isEmpty(display: React.ReactNode): boolean {
  return display == null || (typeof display === "string" && !display.trim());
}

/** 표시 영역 내용: 비어 있으면 placeholder 또는 zero-width, 아니면 display */
function renderDisplayContent(
  display: React.ReactNode,
  placeholder: React.ReactNode,
): React.ReactNode {
  if (!isEmpty(display)) return display;
  if (placeholder != null && placeholder !== "") {
    return (
      <span className="notranslate" style={{ color: "var(--color-gray-500)" }}>
        {placeholder}
      </span>
    );
  }
  return (
    <span className="notranslate" aria-hidden>
      &#8203;
    </span>
  );
}

export const SelectInput = forwardRef<
  HTMLInputElement | { node: HTMLInputElement; value: unknown },
  SelectInputProps<unknown>
>(function SelectInputInner<Value = unknown>(
  props: SelectInputProps<Value>,
  ref: React.Ref<HTMLInputElement | { node: HTMLInputElement; value: Value }>,
) {
  const {
    "aria-describedby": ariaDescribedby,
    "aria-label": ariaLabel,
    autoFocus,
    autoWidth,
    children,
    className,
    defaultOpen,
    defaultValue,
    disabled,
    displayEmpty,
    error = false,
    IconComponent = "span",
    inputRef: inputRefProp,
    labelId,
    MenuProps = {},
    name,
    onBlur,
    onChange,
    onClose,
    onFocus,
    onKeyDown,
    onMouseDown,
    onOpen,
    open: openProp,
    readOnly,
    renderValue,
    required,
    SelectDisplayProps = {},
    tabIndex: tabIndexProp,
    value: valueProp,
    variant = "outlined",
    placeholder,
    ...other
  } = props;

  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [displayNode, setDisplayNode] = useState<HTMLDivElement | null>(null);
  const [menuMinWidth, setMenuMinWidth] = useState<number | undefined>();

  const [value, setValueState] = useControlled<Value | "">({
    controlled: valueProp as Value | "" | undefined,
    default: (defaultValue ?? "") as Value | "",
    name: "Select",
  });

  const [openState, setOpenState] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen ?? false,
    name: "Select",
  });

  const isOpenControlled = openProp != null;
  const anchorElement = displayNode?.parentElement ?? null;
  const open = displayNode !== null && openState;

  const handleDisplayRef = useCallback((node: HTMLDivElement | null) => {
    displayRef.current = node;
    setDisplayNode(node);
  }, []);

  const apiRef = useRef<{
    focus: () => void;
    node: HTMLInputElement | null;
    value: Value | "";
  } | null>(null);
  apiRef.current = {
    focus: () => displayRef.current?.focus(),
    node: inputRef.current,
    value,
  };

  useImperativeHandle(
    ref,
    () =>
      apiRef.current as HTMLInputElement & {
        node: HTMLInputElement | null;
        value: Value;
      },
    [],
  );

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    if (typeof inputRefProp === "function") {
      inputRefProp(
        api as HTMLInputElement & { node: HTMLInputElement; value: Value },
      );
    } else if (inputRefProp && typeof inputRefProp === "object") {
      const refObj = inputRefProp as React.MutableRefObject<unknown>;
      // ref.current 할당은 React ref 전달 관례
      // eslint-disable-next-line react-hooks/immutability
      refObj.current = api;
    }
  }, [value, inputRefProp]);

  useEffect(() => {
    if (!open || !anchorElement || autoWidth) return;
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setMenuMinWidth(anchorElement.clientWidth);
    });
    observer.observe(anchorElement);
    return () => observer.disconnect();
  }, [open, anchorElement, autoWidth]);

  useEffect(() => {
    if (autoFocus) displayRef.current?.focus();
  }, [autoFocus]);

  const updateOpen = useCallback(
    (openParam: boolean, event: React.SyntheticEvent) => {
      if (openParam) onOpen?.(event);
      else onClose?.(event);
      if (!isOpenControlled) {
        setMenuMinWidth(autoWidth ? undefined : anchorElement?.clientWidth);
        setOpenState(openParam);
      }
    },
    [onOpen, onClose, isOpenControlled, autoWidth, anchorElement, setOpenState],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      onMouseDown?.(event);
      if (event.button !== 0) return;
      event.preventDefault();
      displayRef.current?.focus();
      if (!disabled && !readOnly) updateOpen(true, event);
    },
    [disabled, readOnly, onMouseDown, updateOpen],
  );

  const handleClose = useCallback(
    (event: React.SyntheticEvent) => updateOpen(false, event),
    [updateOpen],
  );

  const childrenArray = Array.isArray(children)
    ? children.flat()
    : React.Children.toArray(children);

  const handleChangeFromNative = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;
      const child = childrenArray.find(
        (c): c is React.ReactElement<{ value: unknown }> =>
          React.isValidElement(c) &&
          areEqualValues((c.props as { value?: unknown }).value, targetValue),
      );
      if (child == null) return;
      setValueState(child.props.value as Value);
      onChange?.(event as SelectChangeEvent<Value>, child);
    },
    [childrenArray, onChange, setValueState],
  );

  const handleItemClick = useCallback(
    (child: OptionChildElement) => (event: React.MouseEvent) => {
      if (!(event.currentTarget as HTMLElement).hasAttribute("tabindex"))
        return;
      child.props.onClick?.(event);

      const newValue = child.props.value as Value;

      if (!areEqualValues(value, newValue)) {
        setValueState(newValue);
        const syntheticEvent = Object.create(event.nativeEvent, {
          target: {
            value: { value: newValue, configurable: true },
            writable: true,
          },
        }) as SelectChangeEvent<Value>;
        const ev = syntheticEvent as {
          target: { value: Value; name: string };
        };
        ev.target.name = name ?? "";
        ev.target.value = newValue;
        onChange?.(syntheticEvent, child);
      }
      updateOpen(false, event);
    },
    [value, name, onChange, setValueState, updateOpen],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        !readOnly &&
        [" ", "ArrowUp", "ArrowDown", "Enter"].includes(event.key)
      ) {
        event.preventDefault();
        updateOpen(true, event);
      }
      onKeyDown?.(event);
    },
    [readOnly, updateOpen, onKeyDown],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      if (!open && onBlur) {
        Object.defineProperty(event, "target", {
          writable: true,
          value: { value, name: name ?? "" },
        });
        onBlur(event);
      }
    },
    [open, onBlur, value, name],
  );

  let display: React.ReactNode = null;
  let computeDisplay = false;
  const hasValue = value !== "" && value !== undefined;
  const hasDisplay = hasValue || displayEmpty;

  if (hasDisplay) {
    if (renderValue) display = renderValue(value as Value);
    else computeDisplay = true;
  }

  const validChildren = childrenArray.filter(
    (c): c is OptionChildElement =>
      React.isValidElement(c) &&
      typeof (c.props as { value?: unknown }).value !== "undefined",
  );

  const withSelected = validChildren.map((child) => {
    const childValue = child.props.value;
    const selected = areEqualValues(value, childValue);
    return { child, childValue, selected };
  });

  const displaySingle: React.ReactNode = computeDisplay
    ? (withSelected.find(({ selected }) => selected)?.child.props.children ??
      null)
    : null;

  const items = withSelected.map(({ child, childValue, selected }) =>
    React.cloneElement(child, {
      "aria-selected": selected,
      selected,
      onClick: handleItemClick(child),
      onKeyUp: (e: React.KeyboardEvent) => {
        if (e.key === " ") e.preventDefault();
        (
          child.props as { onKeyUp?: (e: React.KeyboardEvent) => void }
        ).onKeyUp?.(e);
      },
      role: "option",
      "data-value": childValue,
    } as Record<string, unknown>),
  );

  if (computeDisplay) {
    display = displaySingle;
  }

  const menuMinWidthState =
    !autoWidth && isOpenControlled && displayNode
      ? anchorElement?.clientWidth
      : menuMinWidth;

  const tabIndex =
    tabIndexProp !== undefined ? tabIndexProp : disabled ? -1 : 0;
  const buttonId =
    SelectDisplayProps.id ?? (name ? `select-${name}` : undefined);

  const paperStyle: React.CSSProperties = {
    ...MenuProps.PaperProps?.style,
    minWidth: menuMinWidthState,
  };

  return (
    <>
      <SelectDisplay
        ref={handleDisplayRef}
        tabIndex={tabIndex}
        role="combobox"
        aria-controls={open ? listboxId : undefined}
        aria-disabled={disabled ? "true" : undefined}
        aria-expanded={open ? "true" : "false"}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={
          [labelId, buttonId].filter(Boolean).join(" ") || undefined
        }
        aria-describedby={ariaDescribedby}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        onKeyDown={handleKeyDown}
        onMouseDown={disabled || readOnly ? undefined : handleMouseDown}
        onBlur={handleBlur}
        onFocus={onFocus}
        $variant={variant}
        $error={error}
        $disabled={disabled}
        $open={open}
        className={
          [SelectDisplayProps.className, className].filter(Boolean).join(" ") ||
          undefined
        }
        id={buttonId}
        {...SelectDisplayProps}
      >
        {renderDisplayContent(display, placeholder)}
      </SelectDisplay>
      <NativeInput
        ref={inputRef}
        aria-invalid={error}
        value={(value as string) ?? ""}
        name={name}
        aria-hidden
        onChange={handleChangeFromNative}
        tabIndex={-1}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        {...other}
      />
      <IconWrapper $open={open}>
        {React.createElement(IconComponent ?? "span")}
      </IconWrapper>
      <Menu
        id={listboxId}
        open={open}
        onClose={handleClose}
        anchorEl={anchorElement}
        aria-labelledby={labelId}
        aria-multiselectable="false"
        PaperProps={{ ...MenuProps.PaperProps, style: paperStyle }}
        {...MenuProps}
      >
        {items}
      </Menu>
    </>
  );
}) as <Value = unknown>(
  props: SelectInputProps<Value> & {
    ref?: React.Ref<
      HTMLInputElement | { node: HTMLInputElement; value: Value }
    >;
  },
) => React.ReactElement;

(SelectInput as unknown as { displayName?: string }).displayName =
  "SelectInput";

export default SelectInput;

const SelectDisplay = styled.div<{
  $variant: string;
  $error?: boolean;
  $disabled?: boolean;
  $open?: boolean;
}>`
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 1.4375em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  cursor: pointer;
  outline: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const NativeInput = styled.input`
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const IconWrapper = styled.span<{ $open?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s;
  ${({ $open }) => $open && "transform: rotate(180deg);"}
`;
