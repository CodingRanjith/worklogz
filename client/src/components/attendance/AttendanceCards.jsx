import React from "react";

function formatTime(timestamp) {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      title: "Break time",
      value: "00:40 min",
      note: "Avg 30 min",
      accent: "amber",
    },
    {
      title: "Days logged",
      value: Object.keys(grouped).length.toString(),
      note: "This month",
      accent: "violet",
    },
  ];

  return (
    <div className="ms-stat-grid">
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
