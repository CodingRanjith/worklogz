import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../utils/api";
import { FiBell, FiClock, FiUser } from "react-icons/fi";

function ProfileHeader() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.getUsers, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const users = await res.json();
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;

        const currentUser = users.find(u => u._id === userId);
        setUser(currentUser);
      } catch (err) {
        console.error("Error loading user:", err.message);
      }
    };

    if (token) fetchUser();
  }, [token]);

  // Live time update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Format date
  const formatDate = (date) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const firstName = user.name?.split(" ")[0] || user.name;

  return (
    <div className="attendance-profile glass">
      <div className="attendance-profile__primary">
        <div className="attendance-avatar">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={`${user.name}'s profile`}
              className="attendance-avatar__img"
            />
          ) : (
            <FiUser className="attendance-avatar__icon" />
          )}
        </div>
        <div>
          <p className="attendance-eyebrow">{getGreeting()}, {firstName}</p>
          <div className="attendance-name-row">
            <h2>{user.name}</h2>
            <span aria-hidden>👋</span>
          </div>
          <div className="attendance-meta">
            <span>{user.position || "Employee"}</span>
            {user.company && (
              <>
                <span className="dot" />
                <span>{user.company}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="attendance-profile__time">
        <div className="time-pill">
          <FiClock />
          <span>{formatDate(currentTime)}</span>
        </div>
        <p className="time-display">{formatTime(currentTime)}</p>
        <span className="time-label">
          {currentTime.toLocaleString("default", { month: "long" })}{" "}
          {currentTime.getFullYear()} • Live time
        </span>
      </div>

      <button className="attendance-notify" type="button" title="Notifications">
        <FiBell />
        <span className="ping" />
      </button>
    </div>
  );
}

export default ProfileHeader;
