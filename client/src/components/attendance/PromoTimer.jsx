// src/components/attendance/PromoTimer.js
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const PromoTimer = ({ titleText = "Limited time promo" }) => {
  const [inputMinutes, setInputMinutes] = useState(1);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning && time <= 0) {
      handleTimeEnd();
    }
  }, [time, isRunning]);

  const handleTimeEnd = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    audioRef.current?.play();
    Swal.fire({
      icon: "info",
      title: "Time's up!",
      text: "Your promo timer has ended.",
      confirmButtonColor: "#0078d4",
    });
  };

  const startTimer = () => {
    const seconds = parseInt(inputMinutes, 10) * 60;
    if (!seconds) return;

    setTime(seconds);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="ms-promo-card">
      <audio ref={audioRef} src="/test.mp3" preload="auto" />

      <div className="ms-promo-header">
        <span className="eyebrow">Promo timer</span>
        <h2>{isRunning ? "Countdown live" : titleText}</h2>
      </div>

      <div className="ms-promo-controls">
        <input
          type="number"
          min="1"
          value={inputMinutes}
          disabled={isRunning}
          onChange={(e) => setInputMinutes(e.target.value)}
        />
        <span>minutes</span>
        <button onClick={startTimer} disabled={isRunning}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      <div className="ms-promo-count">{formatTime(time)}</div>
    </div>
  );
};

export default PromoTimer;
