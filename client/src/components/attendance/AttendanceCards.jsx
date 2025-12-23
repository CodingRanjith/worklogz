import React from "react";

function formatTime(timestamp) {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(minutes) {
  if (minutes == null) return "--:--";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hrsPart = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : "00:";
  return `${hrsPart}${mins.toString().padStart(2, "0")} min`;
}

function AttendanceCards({ attendanceData = [] }) {
  if (!attendanceData.length) return null;

  const grouped = attendanceData.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const latestDate = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  )[0];

  const latestEntries = grouped[latestDate] || [];

  const checkIn = latestEntries.find((entry) => entry.type === "check-in");
  const checkOut = latestEntries.find((entry) => entry.type === "check-out");

  // Clocked time - calculated time from check-in to check-out
  let clockedTimeMinutes = null;
  if (checkIn && checkOut) {
    const diffMs =
      new Date(checkOut.timestamp).getTime() -
      new Date(checkIn.timestamp).getTime();
    if (diffMs > 0) {
      clockedTimeMinutes = Math.round(diffMs / (1000 * 60));
    }
  }
  
  // Admin-added break time - break time manually added by admin
  const adminBreakMinutes = checkOut?.adminBreakTimeMinutes || 0;

  const cards = [
    {
      title: "Check in",
      value: formatTime(checkIn?.timestamp),
      note: checkIn ? "On time" : "Awaiting entry",
      accent: "emerald",
    },
    {
      title: "Check out",
      value: formatTime(checkOut?.timestamp),
      note: checkOut ? "Logged" : "Pending",
      accent: "blue",
    },
    {
      title: "Clocked break time",
      value: formatDuration(clockedTimeMinutes),
      note: clockedTimeMinutes != null ? "From check in to check out" : "Pending",
      accent: "amber",
    },
    {
      title: "Admin-added break time",
      value: formatDuration(adminBreakMinutes),
      note: adminBreakMinutes > 0 ? "Manually added by admin" : "No admin break time",
      accent: "orange",
    },
    {
      title: "Days logged",
      value: Object.keys(grouped).length.toString(),
      note: "This month",
      accent: "violet",
    },
  ];

  return (
    <div className="ms-stat-grid-5">
      {cards.map((card) => (
        <div key={card.title} className={`ms-stat-card ${card.accent}`}>
          <p className="label">{card.title}</p>
          <p className="value">{card.value}</p>
          <p className="note">{card.note}</p>
        </div>
      ))}
    </div>
  );
}

export default AttendanceCards;
