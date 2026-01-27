import type { ReactNode } from "react";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean; // false면 ScrollArea에 스크롤 X, 기본 true
}

export default function Layout({
  children,
  header,
  footer,
  scrollable = true,
}: LayoutProps) {
  return (
    <AppWrapper>
      <Content>
        {header && <HeaderSlot>{header}</HeaderSlot>}
        <ScrollArea $scrollable={scrollable}>{children}</ScrollArea>
        {footer && <FooterSlot>{footer}</FooterSlot>}
      </Content>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  width: 100%;
  height: 100dvh;
  min-height: -webkit-fill-available;
  max-height: 100dvh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
`;

const HeaderSlot = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

/** Layout 안에 넣은 컴포넌트가 넘치면 이 영역만 스크롤됨. $scrollable=false면 스크롤 없이 잘림 */
const ScrollArea = styled.div<{ $scrollable?: boolean }>`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: ${(props) => (props.$scrollable ? "auto" : "hidden")};
  overflow-x: hidden;
  -webkit-overflow-scrolling: ${(props) =>
    props.$scrollable ? "touch" : "auto"};
`;

const FooterSlot = styled.div`
  flex-shrink: 0;
  width: 100%;
`;
