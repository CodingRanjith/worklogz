import React, { useEffect, useState } from "react";
import { FiBell, FiClock, FiUser, FiEdit2 } from "react-icons/fi";

function ProfileHeader({ profile, onEditProfile }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showIdCard, setShowIdCard] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!profile) return null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (date) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleAvatarClick = () => {
    setShowIdCard((prev) => !prev);
  };

  const downloadIdCard = async () => {
    const width = 640;
    const height = 360;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#111a44";
    ctx.fillRect(0, 0, width, 72);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 22px 'Segoe UI', sans-serif";
    ctx.fillText("Worklogz Identity Card", 24, 44);

    const drawAvatar = async () => {
      const avatarSrc = profile.avatar || profile.profilePic;
      if (!avatarSrc) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = avatarSrc;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      const radius = 52;
      ctx.save();
      ctx.beginPath();
      ctx.arc(96, 164, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 44, 112, radius * 2, radius * 2);
      ctx.restore();
    };

    await drawAvatar();

    ctx.fillStyle = "#111a44";
    ctx.font = "600 28px 'Segoe UI', sans-serif";
    ctx.fillText(profile.name || "Employee", 200, 150);

    ctx.fillStyle = "#5c6382";
    ctx.font = "400 16px 'Segoe UI', sans-serif";
    ctx.fillText(profile.position || "Team member", 200, 178);
    if (profile.company) {
      ctx.fillText(profile.company, 200, 202);
    }

  const rows = [
    { label: "Employee ID", value: profile.employeeId || "—" },
    { label: "Department", value: profile.department || "—" },
    { label: "Location", value: profile.location || "—" },
  ];

    ctx.fillStyle = "#5c6382";
    ctx.font = "600 14px 'Segoe UI', sans-serif";
    rows.forEach((row, index) => {
      const top = 240 + index * 46;
      ctx.fillText(row.label.toUpperCase(), 44, top);
      ctx.fillStyle = "#111a44";
      ctx.font = "500 18px 'Segoe UI', sans-serif";
      ctx.fillText(row.value, 44, top + 22);
      ctx.fillStyle = "#5c6382";
      ctx.font = "600 14px 'Segoe UI', sans-serif";
    });

    ctx.strokeStyle = "#e2e6f4";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${(profile.name || "employee").replace(/\s+/g, "-")}-id.png`;
    link.click();
  };

  const firstName = profile.name?.split(" ")[0] || profile.name;

  return (
    <div className="ms-profile-banner">
      <div className="ms-profile-info">
        <button
          type="button"
          className="ms-avatar"
          onClick={handleAvatarClick}
          aria-label="View identity card"
        >
          {profile.avatar || profile.profilePic ? (
            <img
              src={profile.avatar || profile.profilePic}
              alt={`${profile.name}'s profile`}
            />
          ) : (
            <FiUser />
          )}
        </button>
        <div>
          <p className="ms-eyebrow">
            {getGreeting()}, {firstName}
          </p>
          <div className="ms-name-row">
            <h2>{profile.name}</h2>
          </div>
          <p className="ms-profile-meta">
            {profile.position || "Employee"}
            {profile.department ? ` • ${profile.department}` : ""}
            {profile.company ? ` @ ${profile.company}` : ""}
          </p>
          {profile.location && (
            <p className="ms-profile-meta light">{profile.location}</p>
          )}
        </div>
      </div>

      <div className="ms-time-block">
        <div className="pill">
          <FiClock />
          <span>{formatDate(currentTime)}</span>
        </div>
        <p className="clock">{formatTime(currentTime)}</p>
        <p className="period">
          {currentTime.toLocaleString("default", { month: "long" })}{" "}
          {currentTime.getFullYear()} • Live time
        </p>
      </div>

      <div className="ms-profile-actions">
        {onEditProfile && (
          <button
            type="button"
            className="ms-btn secondary"
            onClick={onEditProfile}
          >
            <FiEdit2 />
            Edit profile
          </button>
        )}
        <button className="ms-icon-btn" type="button" title="Notifications">
          <FiBell />
        </button>
      </div>

      {showIdCard && (
        <div className="identity-overlay" onClick={() => setShowIdCard(false)}>
          <div className="identity-card" onClick={(e) => e.stopPropagation()}>
            <header>
              <div>
                <p className="identity-eyebrow">Worklogz</p>
                <h3>Identity card</h3>
              </div>
              {profile.avatar || profile.profilePic ? (
                <img
                  src={profile.avatar || profile.profilePic}
                  alt={`${profile.name} avatar`}
                />
              ) : (
                <div className="identity-avatar-fallback">
                  <FiUser />
                </div>
              )}
            </header>
            <div className="identity-body">
              <div>
                <p className="identity-label">Name</p>
                <p className="identity-value">{profile.name || "Employee"}</p>
              </div>
              <div>
                <p className="identity-label">Employee ID</p>
                <p className="identity-value">{profile.employeeId || "—"}</p>
              </div>
              <div>
                <p className="identity-label">Role</p>
                <p className="identity-value">{profile.position || "Team member"}</p>
              </div>
              <div>
                <p className="identity-label">Department</p>
                <p className="identity-value">{profile.department || "—"}</p>
              </div>
              <div>
                <p className="identity-label">Company</p>
                <p className="identity-value">{profile.company || "Worklogz"}</p>
              </div>
            </div>
            <button
              type="button"
              className="identity-download"
              onClick={downloadIdCard}
            >
              Download ID
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;
