import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import SessionForm from "./SessionForm";
import type { LocationFormData } from "./SessionForm";

const COLLAPSED_HEIGHT = 32; // 축소 상태 높이
const MAX_HEIGHT = 420; // 최대 높이

export interface SessionBottomSheetProps {
  /** CreateSession에서 관리하는 위치·경로 데이터 (SessionForm 제출용, routeNodes 포함 파생) */
  locationFormData?: LocationFormData;
}

export interface SessionBottomSheetRef {
  /** 바텀시트를 드래그 인디케이터만 보이는 초기 높이로 접기 */
  collapse: () => void;
}

const SessionBottomSheet = forwardRef<
  SessionBottomSheetRef,
  SessionBottomSheetProps
>(function SessionBottomSheet({ locationFormData }, ref) {
  // 0단계. 드래그 시작 시점에서 시작 Y 좌표와 시작 높이를 저장 + isDragging 상태 변경
  const [sheetHeight, setSheetHeight] = useState(COLLAPSED_HEIGHT); // 현재 보이는 높이
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부(드래그 중일 때는 높이 변경 금지)
  const dragStartY = useRef(0); // 터치/클릭이 시작된 시점의 Y 좌표
  const dragStartHeight = useRef(COLLAPSED_HEIGHT); // 드래그 시작 시점의 높이
  const dragEndRef = useRef<(() => void) | null>(null); // handleDragEnd 제거 시 동일 참조용

  // 드래그로 계산한 높이가 COLLAPSED_HEIGHT ~ MAX_HEIGHT 사이로 제한하는 함수
  // useCallback으로 한 번 만 만들어 두고, 드래그 핸들러에서 재사용하기 위해 사용
  const clampHeight = useCallback((h: number) => {
    return Math.min(MAX_HEIGHT, Math.max(COLLAPSED_HEIGHT, h));
  }, []);

  // 2단계. 드래그 시작 시점에서 시작 Y 좌표와 시작 높이를 저장 + isDragging 상태 변경
  // - 사용자가 드래그를 시작한 순간의 "손가락/마우스 Y 좌표"와 "그 순간의 시트 높이" 저장
  //     1. 드래그를 위로 끌어당김(Y가 줄어듦) -> 시트 늘려야 함 -> sheetHeight 증가
  //     2. 드래그를 아래로 끌어당김(Y가 증가함) -> 시트 줄여야 함 -> sheetHeight 감소
  //     => 이동한 Y 거리만큼 sheetHeight를 증가/감소시키면 됨
  //     결론: 새 높이 = 시작 높이 + (시작 Y 좌표 - 현재 Y 좌표)
  // - dragStartY(시작 Y 좌표), dragStartHeight(시작 높이)를 ref로 저장하는 이유
  //     - useState는 값이 변경될 때마다 렌더링을 다시 함 -> 타이밍에 따라 값이 어긋날 수 있음
  //     - 드래그를 끝까지 하는 동안은 높이 값이 그대로여야 하기 때문
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const clientY =
        e instanceof TouchEvent
          ? e.touches[0].clientY
          : (e as React.MouseEvent).clientY;
      dragStartY.current = clientY;
      dragStartHeight.current = sheetHeight;
      setIsDragging(true);
    },
    [sheetHeight],
  );

  // 3단계. 드래그 중 새 높이 Y를 구하여 sheetHeight 업데이트
  // 1. handleDragMove(드래그 중): 마우스/터치 move에서 현재 Y 좌표 구하여
  //     - 새 높이 = clampHeight(시작 높이 + (시작Y - 현재Y))로 계산 후 sheetHeight 업데이트
  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const clientY =
        e instanceof TouchEvent
          ? e.touches[0].clientY
          : (e as MouseEvent).clientY;
      const newHeight = clampHeight(
        dragStartHeight.current + (dragStartY.current - clientY),
      );
      setSheetHeight(newHeight);
      if (e instanceof TouchEvent) e.preventDefault(); // 터치 시 화면 스크롤 방지
    },
    [clampHeight],
  );
  // 2. handleDragEnd(드래그 종료): document에 붙였던 move/end 리스너를 모두 제거하고 isDragging 상태를 false로 변경
  const handleDragEnd = useCallback(() => {
    document.removeEventListener("mousemove", handleDragMove);
    if (dragEndRef.current) {
      document.removeEventListener("mouseup", dragEndRef.current);
      document.removeEventListener("touchend", dragEndRef.current);
    }
    document.removeEventListener("touchmove", handleDragMove);
    setIsDragging(false);
  }, [handleDragMove]);
  useEffect(() => {
    dragEndRef.current = handleDragEnd;
  }, [handleDragEnd]);
  // 3. 드래그 시작 시 리스너 등록
  //     - useEffect 사용하여 드래그 시작 시점에 리스너 등록
  //     - isDragging이 true가 되었을 때 useEffect로 document에 mousemove/mouseup/touchmove/touchend 리스너를 붙이고, cleanup에서 제거.
  // - 왜 DragIndicator 대신 document에 이벤트 리슨너 할까?
  //     - DragIndicator를 조금이라도 벗어나면 드래그 시작으로 인식되어 높이 변경 로직이 실행되어야 하기 때문
  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 바텀시트 이외 영역 클릭/터치 시 부모에서 호출하여 초기 높이로 접기
  const collapse = useCallback(() => {
    setSheetHeight(COLLAPSED_HEIGHT);
  }, []);
  useImperativeHandle(ref, () => ({ collapse }), [collapse]);

  return (
    <BottomSheet style={{ height: `${sheetHeight}px` }}>
      {/* 1단계. 초기에 DragIndicator만 보이도록 설정
       * BottomSheet의 높이를 sheetHeight으로 설정하여 state 변함에 따라 보이는 높이가 동적으로 변경
       * -> 높이 값이 바뀌면, 브라우저는 자동으로 렌더링을 다시 함
       * -> 이때 드래그 핸들러가 다시 호출되어 높이 변경 로직이 실행됨
       */}
      <DragIndicator
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      />
      <SessionForm locationFormData={locationFormData} />
    </BottomSheet>
  );
});

const BottomSheet = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  padding-top: 10px;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px 0 rgba(0, 0, 0, 0.08);
  background-color: var(--color-bg);
  overflow-y: auto;
  overflow-x: hidden;
`;

const DragIndicator = styled.div`
  width: 40px;
  height: 4px;
  background-color: var(--color-gray-400);
  border-radius: 2px;
  cursor: grab;
  flex-shrink: 0;
  &:active {
    cursor: grabbing;
  }
`;

export default SessionBottomSheet;
