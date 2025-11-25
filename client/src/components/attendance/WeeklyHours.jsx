import React, { useCallback, useMemo, useState } from "react";
import "../../styles/systemAppTheme.css";

const WeeklyHours = ({ attendanceHistory = [] }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekRange = useCallback(() => {
    const today = new Date();
    const start = new Date(today);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff + weekOffset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }, [weekOffset]);

  const metrics = useMemo(() => {
    const { start, end } = getWeekRange();
    let total = 0;
    let workingDays = 0;

    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const key = cursor.toDateString();
      const dayEntries = attendanceHistory.filter(
        (entry) => new Date(entry.timestamp).toDateString() === key
      );
      const checkIn = dayEntries.find((entry) => entry.type === "check-in");
      const checkOut = dayEntries.find((entry) => entry.type === "check-out");
      if (checkIn && checkOut) {
        total += (new Date(checkOut.timestamp) - new Date(checkIn.timestamp)) / (1000 * 60 * 60);
        workingDays += 1;
      }
    }

    return { totalHours: total, workingDays };
  }, [attendanceHistory, getWeekRange]);

  const expectedHours = Math.max(metrics.workingDays * 8, 40);
  const efficiency = expectedHours ? Math.min((metrics.totalHours / expectedHours) * 100, 100) : 0;

  const formatWeekLabel = () => {
    const { start, end } = getWeekRange();
    return `${start.toLocaleDateString("en-GB")} — ${end.toLocaleDateString("en-GB")}`;
  };

  const formatTime = (hoursValue) => {
    const hours = Math.floor(hoursValue);
    const minutes = Math.floor((hoursValue - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const getStatus = () => {
    if (efficiency >= 90) return { label: "Excellent", tone: "success" };
    if (efficiency >= 75) return { label: "On track", tone: "info" };
    if (efficiency >= 50) return { label: "Needs focus", tone: "warning" };
    return { label: "Below target", tone: "danger" };
  };

  const status = getStatus();

  return (
    <div className="panel weekly-hours">
      <div className="weekly-hours__header">
        <div>
          <p className="eyebrow">Weekly performance</p>
          <h3>{formatWeekLabel()}</h3>
        </div>
        <div className="nav">
          <button
            type="button"
            className="secondary"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            ‹
          </button>
          {weekOffset !== 0 && (
            <button
              type="button"
              className="primary"
              onClick={() => setWeekOffset(0)}
            >
              This week
            </button>
          )}
          <button
            type="button"
            className="secondary"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="weekly-hours__grid">
        <div className="stat">
          <p className="label">Expected hours</p>
          <p className="value">{expectedHours.toFixed(0)}</p>
          <p className="hint">Standard work week</p>
        </div>
        <div className="stat">
          <p className="label">Worked hours</p>
          <p className="value">{formatTime(metrics.totalHours)}</p>
          <div className="mini-progress">
            <div className="track">
              <div
                className="fill"
                style={{ width: `${Math.min((metrics.totalHours / expectedHours) * 100, 100)}%` }}
              />
            </div>
            <p>{metrics.workingDays} active days</p>
          </div>
        </div>
        <div className="stat">
          <p className="label">Efficiency</p>
          <p className="value">{Math.round(efficiency)}%</p>
          <p className="hint">vs expected time</p>
        </div>
        <div className={`stat badge ${status.tone}`}>
          <p className="label">Status</p>
          <p className="value">{status.label}</p>
          <p className="hint">
            {weekOffset === 0
              ? "Current week"
              : weekOffset > 0
              ? `${weekOffset} week${weekOffset > 1 ? "s" : ""} ahead`
              : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? "s" : ""} ago`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHours;