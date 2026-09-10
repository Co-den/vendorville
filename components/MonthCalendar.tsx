// components/MonthCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import { getPreviousMonths } from "@/utils/dateFilters";
import "./calender.css";

interface MonthData {
  month: string;
  year: number;
  value: string;
  startDate: string;
  endDate: string;
}

interface MonthCalendarProps {
  onMonthSelect: (monthData: MonthData) => void;
}

export default function MonthCalendar({ onMonthSelect }: MonthCalendarProps) {
  const months: MonthData[] = getPreviousMonths(12);

  const currentMonthValue = new Date().toISOString().slice(0, 7);

  const initialIndex = Math.max(
    0,
    months.findIndex((month) => month.value === currentMonthValue),
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthValue);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  const currentMonth = months[currentIndex];

  const calendarDays = useMemo(() => {
    if (!currentMonth) return [];

    const [year, month] = currentMonth.value.split("-").map(Number);

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: Array<{
      date: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Previous month's dates
    const previousMonthLastDay = new Date(year, month - 1, 0).getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: previousMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month's dates
    const today = new Date();

    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          today.getFullYear() === year &&
          today.getMonth() === month - 1 &&
          today.getDate() === date,
      });
    }

    // Next month's dates
    const remainingDays = 42 - days.length;

    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentMonth]);

  const handleMonthSelect = (month: MonthData, index: number) => {
    setSelectedMonth(month.value);
    setCurrentIndex(index);
    onMonthSelect(month);
  };

  const goToPreviousMonth = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      handleMonthSelect(months[newIndex], newIndex);
    }
  };

  const goToNextMonth = () => {
    if (currentIndex < months.length - 1) {
      const newIndex = currentIndex + 1;
      handleMonthSelect(months[newIndex], newIndex);
    }
  };

  if (!currentMonth) {
    return (
      <div className="month-calendar">
        <p>No months available</p>
      </div>
    );
  }

  return (
    <div className="month-calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav-button"
          onClick={goToPreviousMonth}
          disabled={currentIndex === 0}
          aria-label="Previous month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="calendar-title">
          <h2>
            {currentMonth.month} {currentMonth.year}
          </h2>
          <span>Monthly view</span>
        </div>

        <button
          type="button"
          className="calendar-nav-button"
          onClick={goToNextMonth}
          disabled={currentIndex === months.length - 1}
          aria-label="Next month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {calendarDays.map((day, index) => (
          <button
            key={`${day.date}-${index}`}
            type="button"
            disabled={!day.isCurrentMonth}
            className={`calendar-day ${
              !day.isCurrentMonth ? "outside-month" : ""
            } ${day.isToday ? "today" : ""} ${
              selectedMonth === currentMonth.value && day.isCurrentMonth
                ? "selected"
                : ""
            }`}
            onClick={() => {
              if (day.isCurrentMonth) {
                handleMonthSelect(currentMonth, currentIndex);
              }
            }}
          >
            <span>{day.date}</span>

            {day.isToday && <span className="today-indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
}
