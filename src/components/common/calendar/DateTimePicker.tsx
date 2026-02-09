import { format, isSameDay, startOfDay } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

import CalendarIcon from "../../../assets/icon/calendar.svg?react";
import { Button } from "../button/Button";

type TFilterTime = (time: Date) => boolean;
type TOpenDirection = "above" | "below";

export default function DateTimePicker({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  const calendarRef = useRef<HTMLDivElement>(null);
  // 초기값: 현재 + 20분 이후, 10분 단위로 올림 (선택 가능한 최소 시간)
  const getInitialDateTime = () => {
    const t = Date.now() + 20 * 60 * 1000;
    const intervalMs = 10 * 60 * 1000;
    return new Date(Math.ceil(t / intervalMs) * intervalMs);
  };
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    getInitialDateTime,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<TOpenDirection>("below");

  const filterPassedTime: TFilterTime = (time) => {
    const now = Date.now();
    const minAllowed = now + 20 * 60 * 1000; // 현재 시간 + 20분 이후만 선택 가능
    return new Date(time).getTime() >= minAllowed;
  };

  const handleToggle = () => {
    if (!isOpen) {
      const rect = calendarRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        const minSpaceNeeded = 10;
        setOpenDirection(spaceBelow < minSpaceNeeded ? "above" : "below");
      }
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calendar = isOpen && (
    <DatePicker
      className="date-picker"
      selected={selectedDateTime}
      minDate={startOfDay(new Date())}
      onChange={(dates: Date | Date[] | null) => {
        const date = Array.isArray(dates) ? (dates[0] ?? null) : dates;
        const nextDate = date ?? new Date();
        setSelectedDateTime(nextDate);
        // 같은 날짜에서 시간만 바뀐 경우 = 시간 선택 → 캘린더 닫기
        if (
          selectedDateTime &&
          isSameDay(selectedDateTime, nextDate) &&
          (selectedDateTime.getHours() !== nextDate.getHours() ||
            selectedDateTime.getMinutes() !== nextDate.getMinutes())
        ) {
          setIsOpen(false);
        }
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={10}
      filterTime={filterPassedTime}
      inline
      locale={ko}
      formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
      dateFormat="yyyy년 MM월 d일 aa hh:mm"
    />
  );

  return (
    <PickerWrapper ref={calendarRef}>
      {label && <Label>{label}</Label>}
      <input
        type="hidden"
        name={name}
        value={
          selectedDateTime
            ? format(selectedDateTime, "yyyy-MM-dd'T'HH:mm:ss")
            : ""
        }
        readOnly
        aria-hidden
      />
      {openDirection === "above" && <CalendarSlot>{calendar}</CalendarSlot>}
      <Button
        type="button"
        onClick={handleToggle}
        startIcon={<CalendarIcon />}
        fullWidth
        size="sm"
        variant="neutral"
      >
        {selectedDateTime
          ? format(selectedDateTime, "yyyy년 MM월 d일 HH:mm")
          : "날짜 선택"}
      </Button>
      {openDirection === "below" && <CalendarSlot>{calendar}</CalendarSlot>}
    </PickerWrapper>
  );
}

const PickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
  box-sizing: border-box;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  display: block;
  width: 100%;
  text-align: left;
`;

const CalendarSlot = styled.div`
  flex-shrink: 0;
  z-index: 999;
  container-type: inline-size;
  container-name: calendar-slot;

  /* ----- Wrapper & Root ----- */
  .react-datepicker-wrapper {
    display: flex;
    width: 100%;
    min-width: 0;
  }

  .react-datepicker {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    box-sizing: border-box;
    width: fit-content;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    font-size: 0.7rem;
    text-align: center;
    border: 1px solid var(--color-gray-200);
    border-radius: 8px;

    &:focus {
      border-color: var(--color-main);
    }
  }

  /* ----- Date: Header ----- */
  .react-datepicker__month-container .react-datepicker__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    min-height: 36px;
    min-width: 0;
    padding: 0 32px;
    font-size: 0.8rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  .react-datepicker__month-container
    .react-datepicker__header
    h2.react-datepicker__current-month {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ----- Date: Navigation ----- */
  .react-datepicker__navigation {
    width: 24px;
    height: 24px;
    top: 6px;
    padding: 0;
  }

  /* ----- Date: Month grid ----- */
  .react-datepicker__month-container {
    float: none;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    min-width: 0;
    max-width: 100%;
    width: 220px;
    box-sizing: border-box;
  }

  .react-datepicker__month {
    margin: 4px 8px 0 8px !important;
  }

  /* ----- Time: Container & Header ----- */
  .react-datepicker__time-container {
    float: none;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-self: stretch;
    width: 60px;
    box-sizing: border-box;
  }

  .react-datepicker__time-container .react-datepicker__header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    min-height: 36px;
    padding: 0 5px 2px 5px !important;
    font-size: 0.65rem;
    box-sizing: border-box;
  }

  /* ----- Time: List (scroll area) ----- */
  .react-datepicker__time-container .react-datepicker__time {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-height: 130px;
    min-height: 0;
  }

  .react-datepicker__time-container .react-datepicker__time-box {
    flex: 1;
    min-height: 0;
    width: 60px;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  ul.react-datepicker__time-list {
    width: 60px;
    max-height: 130px;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
    height: auto !important;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .react-datepicker__time-list-item {
    width: 60px;
    height: 28px;
    padding: 2px 6px !important;
    box-sizing: border-box;
  }

  /* ----- Responsive: narrow (date + time stacked) ----- */
  @container calendar-slot (max-width: 279px) {
    .react-datepicker {
      flex-direction: column;
    }

    .react-datepicker__month-container {
      width: 100%;
    }

    .react-datepicker__navigation--next.react-datepicker__navigation--next--with-time {
      right: 4px;
    }

    .react-datepicker__time-container {
      width: 100%;
      min-width: 0;
      border-left: none;
      border-top: 1px solid var(--color-gray-200);
    }

    .react-datepicker__time-box,
    ul.react-datepicker__time-list,
    .react-datepicker__time-list-item {
      width: 100%;
    }
  }
`;
