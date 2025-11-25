import React from "react";
import AttendanceCards from "./AttendanceCards";
import ActivityLog from "./ActivityLog";

const TodayAttendance = ({ attendanceHistory, selectedDate }) => {
  const filteredLogs = attendanceHistory.filter(
    (entry) =>
      new Date(entry.timestamp).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="ms-panel today-attendance">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Daily attendance</p>
          <h3>Track today's participation</h3>
          <p className="supporting">
            Real-time summary of your latest attendance activity.
          </p>
        </div>
      </div>

      <AttendanceCards attendanceData={attendanceHistory} />

      <div className="panel-section">
        <ActivityLog activities={filteredLogs} />
      </div>
    </div>
  );
};

export default TodayAttendance;
