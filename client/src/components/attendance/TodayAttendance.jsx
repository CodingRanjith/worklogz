import React from 'react';
import AttendanceCards from './AttendanceCards';
import ActivityLog from './ActivityLog';

const TodayAttendance = ({ attendanceHistory, selectedDate }) => {
  // Filter logs for the selected date
  const filteredLogs = attendanceHistory.filter(
    (entry) =>
      new Date(entry.timestamp).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-teal-100 rounded-lg">
          <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-teal-900">Daily Attendance</h3>
          <p className="text-sm text-teal-600">Monitor your daily work activities and time tracking</p>
        </div>
      </div>
      
      {/* Attendance Cards */}
      <AttendanceCards attendanceData={attendanceHistory} />
      
      {/* Activity Log */}
      <div className="mt-6">
        <ActivityLog activities={filteredLogs} />
      </div>
    </div>
  );
};

export default TodayAttendance;
