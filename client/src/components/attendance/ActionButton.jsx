import React from "react";

function ActionButton({ type, onClick }) {
  const isCheckIn = type === "check-in";

  return (
    <button
      onClick={onClick}
      className={`ms-check-btn ${isCheckIn ? "primary" : "secondary"}`}
    >
      {isCheckIn ? "Check In" : "Check Out"}
    </button>
  );
}

export default ActionButton;
