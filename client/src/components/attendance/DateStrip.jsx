import React, { useMemo, useState } from "react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = Array.from({ length: 12 }, (_, idx) =>
  new Date(0, idx).toLocaleString("default", { month: "short" })
);

function DateStrip({ selectedDate, setSelectedDate, attendanceHistory = [] }) {
  const today = new Date();
  const [viewingMonth, setViewingMonth] = useState(today.getMonth());
  const [viewingYear, setViewingYear] = useState(today.getFullYear());

  const dailyWorkHours = useMemo(() => {
    const hoursMap = {};
    attendanceHistory.forEach((entry) => {
      const key = new Date(entry.timestamp).toDateString();
      hoursMap[key] = hoursMap[key] || { in: null, out: null };
      if (entry.type === "check-in") hoursMap[key].in = entry.timestamp;
      if (entry.type === "check-out") hoursMap[key].out = entry.timestamp;
    });

    const computed = {};
    Object.entries(hoursMap).forEach(([key, { in: checkIn, out: checkOut }]) => {
      if (checkIn && checkOut) {
        const diff = new Date(checkOut) - new Date(checkIn);
        computed[key] = diff / (1000 * 60 * 60);
      } else if (checkIn) {
        computed[key] = 0;
      }
    });
    return computed;
  }, [attendanceHistory]);

  const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(viewingYear, viewingMonth, index + 1);
      const dateKey = date.toDateString();
      const hours = dailyWorkHours[dateKey] || 0;
      return {
        date,
        label: DAY_LABELS[date.getDay()],
        dayNumber: date.getDate(),
        workHours: hours,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isFuture: date > today,
      };
    });
  }, [dailyWorkHours, daysInMonth, selectedDate, today, viewingMonth, viewingYear]);

  const totalHours = useMemo(() => {
    const start = new Date(viewingYear, viewingMonth, 1);
    const end = new Date(viewingYear, viewingMonth + 1, 0);
    let sum = 0;
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const key = date.toDateString();
      sum += dailyWorkHours[key] || 0;
    }
    return sum;
  }, [dailyWorkHours, viewingMonth, viewingYear]);

  const formatEffort = () => {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const navigateMonth = (direction) => {
    const newMonth = viewingMonth + direction;
    const date = new Date(viewingYear, newMonth, 1);
    setViewingMonth(date.getMonth());
    setViewingYear(date.getFullYear());
  };

  const progress = Math.min((totalHours / 160) * 100, 100);

  const getDayClass = (day) => {
    const classes = ["ms-day-card"];
    if (day.isSelected) classes.push("is-selected");
    if (day.isToday && !day.isSelected) classes.push("is-today");
    if (day.isWeekend) classes.push("is-weekend");
    if (day.workHours === 0 && !day.isWeekend && !day.isFuture) classes.push("is-absent");
    if (day.isFuture) classes.push("is-future");
    return classes.join(" ");
  };

  const getBadgeClass = (day) => {
    if (day.isFuture) return "badge neutral";
    if (day.workHours >= 8) return "badge success";
    if (day.workHours >= 4) return "badge warning";
    if (day.workHours > 0) return "badge info";
    return "badge ghost";
  };

  return (
    <div className="ms-panel date-strip">
      <div className="date-strip__header">
        <div>
          <p className="eyebrow">Effort tracker</p>
          <h3>
            {MONTH_NAMES[viewingMonth]} {viewingYear}
          </h3>
        </div>
        <div className="date-strip__controls">
          <button type="button" onClick={() => navigateMonth(-1)}>
            ‹
          </button>
          <button type="button" onClick={() => navigateMonth(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="date-strip__months">
        {MONTH_NAMES.map((name, idx) => {
          const active = idx === viewingMonth;
          return (
            <button
              key={name}
              type="button"
              className={`ms-month-pill ${active ? "active" : ""}`}
              onClick={() => setViewingMonth(idx)}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="date-strip__days">
        {days.map((day) => (
          <button
            key={day.date.toISOString()}
            type="button"
            className={getDayClass(day)}
            onClick={() => !day.isFuture && setSelectedDate(day.date)}
            disabled={day.isFuture}
          >
            <span className="day-label">{day.label}</span>
            <span className="day-number">{day.dayNumber}</span>
            <span className={getBadgeClass(day)}>
              {day.workHours ? `${day.workHours.toFixed(1)}h` : "—"}
            </span>
          </button>
        ))}
      </div>

      <div className="date-strip__footer">
        <div>
          <p className="eyebrow">Total effort</p>
          <p className="effort-value">{formatEffort()} hrs</p>
        </div>
        <div className="progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-label">{Math.round(progress)}% of 160h target</p>
        </div>
      </div>
    </div>
  );
}
export default DateStrip;