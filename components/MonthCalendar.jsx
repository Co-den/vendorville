import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPreviousMonths } from "@/utils/dateFilters";
import "./calender.css"

export default function MonthCalendar({ onMonthSelect }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const months = getPreviousMonths(12);

  const handleSelect = (monthData) => {
    setSelectedMonth(monthData.value);
    onMonthSelect(monthData);
  };

  return (
    <div className="month-calendar">
      <div className="month-selector">
        <select
          value={selectedMonth}
          onChange={(e) => {
            const month = months.find((m) => m.value === e.target.value);
            if (month) handleSelect(month);
          }}
          className="month-select"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.month} {month.year}
            </option>
          ))}
        </select>
      </div>

      <div className="month-grid">
        {months.map((month) => (
          <button
            key={month.value}
            onClick={() => handleSelect(month)}
            className={`month-card ${selectedMonth === month.value ? "active" : ""}`}
          >
            <div className="month-name">{month.month}</div>
            <div className="month-year">{month.year}</div>
          </button>
        ))}
      </div>
    </div>
  );
}