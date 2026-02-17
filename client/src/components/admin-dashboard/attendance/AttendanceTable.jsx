import React from 'react';
import { FiUser, FiMail, FiMapPin, FiClock, FiCalendar, FiHome, FiLogIn, FiLogOut } from 'react-icons/fi';

const AttendanceTable = ({ records }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="attendance-table-wrapper">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>
              <div className="table-header-cell">
                <FiUser className="table-header-icon" />
                Employee
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiMail className="table-header-icon" />
                Email
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiLogIn className="table-header-icon" />
                Type
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiMapPin className="table-header-icon" />
                Location
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiClock className="table-header-icon" />
                Time
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiCalendar className="table-header-icon" />
                Date
              </div>
            </th>
            <th>
              <div className="table-header-cell">
                <FiHome className="table-header-icon" />
                In Office
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-state-cell">
                <div className="empty-state">
                  <FiClock className="empty-state-icon" />
                  <p className="empty-state-text">No attendance records found</p>
                  <p className="empty-state-subtext">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
          ) : (
            records.map((record, index) => {
              const isCheckIn = record.type === 'check-in';
              return (
                <tr key={record._id || index} className="table-row">
                  <td>
                    <div className="employee-cell">
                      {record.user?.profilePic ? (
                        <img 
                          src={record.user.profilePic} 
                          alt={record.user?.name || 'User'} 
                          className="employee-avatar"
                        />
                      ) : (
                        <div className="employee-avatar-placeholder">
                          {(record.user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="employee-info">
                        <span className="employee-name">{record.user?.name || record.employeeName || 'Unknown'}</span>
                        {record.user?.department && (
                          <span className="employee-dept">{record.user.department}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="email-cell">{record.user?.email || '—'}</span>
                  </td>
                  <td>
                    <span className={`type-badge ${isCheckIn ? 'type-checkin' : 'type-checkout'}`}>
                      {isCheckIn ? (
                        <>
                          <FiLogIn className="type-icon" />
                          Check In
                        </>
                      ) : (
                        <>
                          <FiLogOut className="type-icon" />
                          Check Out
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="location-cell">
                      <FiMapPin className="location-icon" />
                      <span>{record.location || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="time-cell">{formatTime(record.timestamp)}</span>
                  </td>
                  <td>
                    <span className="date-cell">{formatDate(record.timestamp)}</span>
                  </td>
                  <td>
                    <span className={`office-badge ${record.isInOffice ? 'office-yes' : 'office-no'}`}>
                      {record.isInOffice ? (
                        <>
                          <FiHome className="office-icon" />
                          Yes
                        </>
                      ) : (
                        <>
                          <FiMapPin className="office-icon" />
                          Remote
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
