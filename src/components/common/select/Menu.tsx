import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/** 메뉴 최대 높이 - placement 'auto' 시 아래/위 공간 판단에 사용 */
const MENU_MAX_HEIGHT = 300;

export type MenuPlacement = "auto" | "bottom" | "top";

export interface MenuProps {
  open: boolean;
  onClose: (event: React.SyntheticEvent) => void;
  anchorEl: HTMLElement | null;
  children: React.ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-multiselectable"?: "true" | "false";
  disableListWrap?: boolean;
  MenuListProps?: React.HTMLAttributes<HTMLUListElement>;
  PaperProps?: React.HTMLAttributes<HTMLDivElement> & {
    style?: React.CSSProperties;
  };
  placement?: MenuPlacement;
}

export function Menu({
  open,
  onClose,
  anchorEl,
  children,
  id,
  "aria-labelledby": ariaLabelledby,
  "aria-multiselectable": ariaMultiselectable,
  MenuListProps = {},
  PaperProps = {},
  placement = "auto",
}: MenuProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !anchorEl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(e as unknown as React.SyntheticEvent);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, anchorEl]);

  useEffect(() => {
    if (!open || !anchorEl) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        paperRef.current &&
        !paperRef.current.contains(target) &&
        !anchorEl.contains(target)
      ) {
        onClose(e as unknown as React.SyntheticEvent);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorEl]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openAbove =
    placement === "top" ||
    (placement === "auto" &&
      spaceBelow < MENU_MAX_HEIGHT &&
      spaceAbove > spaceBelow);

  const GAP = 8;
  const maxHeightBelow = Math.max(0, spaceBelow - GAP);
  const maxHeightAbove = Math.max(0, spaceAbove - GAP);
  const paperMaxHeight = openAbove
    ? Math.min(MENU_MAX_HEIGHT, maxHeightAbove)
    : Math.min(MENU_MAX_HEIGHT, maxHeightBelow);

  const paperMinWidth =
    typeof PaperProps.style?.minWidth === "number"
      ? PaperProps.style.minWidth
      : rect.width;

  const paperStyle: React.CSSProperties = {
    left: rect.left,
    ...PaperProps.style,
    minWidth: paperMinWidth,
    maxHeight: paperMaxHeight,
    ...(openAbove
      ? { bottom: window.innerHeight - rect.top + 4, top: "auto" }
      : { top: rect.bottom + 4 }),
  };

  const content = (
    <>
      <Backdrop
        aria-hidden
        tabIndex={-1}
        onMouseDown={(e) => {
          e.preventDefault();
          onClose(e);
        }}
      />
      <Paper
        ref={paperRef}
        $minWidth={paperMinWidth}
        $openAbove={openAbove}
        {...PaperProps}
        style={paperStyle}
      >
        <List
          ref={listRef}
          role="listbox"
          id={id}
          aria-labelledby={ariaLabelledby}
          aria-multiselectable={ariaMultiselectable}
          tabIndex={-1}
          {...MenuListProps}
        >
          {children}
        </List>
      </Paper>
    </>
  );

  return createPortal(content, document.body);
}

Menu.displayName = "Menu";

export default Menu;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1199;
  background: transparent;
`;

const Paper = styled.div<{ $minWidth?: number; $openAbove?: boolean }>`
  position: fixed;
  z-index: 1200;
  min-width: ${({ $minWidth }) =>
    $minWidth != null ? `${$minWidth}px` : "auto"};
  max-height: ${MENU_MAX_HEIGHT}px;
  overflow: auto;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  ${({ $openAbove }) =>
    $openAbove ? "margin-bottom: 4px;" : "margin-top: 4px;"}
`;

const List = styled.ul`
  margin: 0;
  padding: 4px 0;
  list-style: none;
  outline: none;
`;
