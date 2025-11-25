import React from "react";

function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="ms-activity empty">
        No activity on selected date
      </div>
    );
  }

  return (
    <div className="ms-activity">
      <div className="ms-activity__header">
        <h3>Your Activity</h3>
        <span>{activities.length} entries</span>
      </div>
      <ul>
        {activities.map((item, index) => {
          const timestamp = new Date(item.timestamp);
          return (
            <li key={index} className="ms-activity-item">
              <div>
                <p className="type">{item.type?.replace("-", " ")}</p>
                <p className="date">
                  {timestamp.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="time">
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityLog;
