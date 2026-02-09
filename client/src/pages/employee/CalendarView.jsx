import React, { useEffect, useState, useCallback } from "react";
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiMapPin } from "react-icons/fi";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/api";

const EVENT_TYPES = [
  { label: "Meeting", value: "meeting", icon: "👥" },
  { label: "Training", value: "training", icon: "📚" },
  { label: "Deadline", value: "deadline", icon: "⏰" },
  { label: "Birthday", value: "birthday", icon: "🎂" },
  { label: "Anniversary", value: "anniversary", icon: "🎉" },
  { label: "Holiday", value: "holiday", icon: "🏖️" },
  { label: "Other", value: "other", icon: "📌" },
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [timesheetEntries, setTimesheetEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventType: "meeting",
    startDate: "",
    endDate: "",
    isAllDay: false,
    location: "",
    color: "#0078d4",
  });

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_ENDPOINTS.getUserEvents, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setEvents(data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(API_ENDPOINTS.getMyAttendance, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }, []);

  const fetchTimesheetEntries = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const response = await axios.get(`${API_ENDPOINTS.baseURL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate,
          endDate
        }
      });
      
      // API returns { tasks: [...], pagination: {...} }
      const tasksArray = Array.isArray(response.data?.tasks) ? response.data.tasks : 
                        Array.isArray(response.data) ? response.data : [];
      
      // Filter timesheet entries (tasks with startTime/endTime)
      const entries = tasksArray.filter(task => task.startTime && task.endTime);
      setTimesheetEntries(entries);
    } catch (error) {
      console.error("Error fetching timesheet entries:", error);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
    fetchAttendance();
    fetchTimesheetEntries();
  }, [currentDate, fetchEvents, fetchAttendance, fetchTimesheetEntries]);

  const getAttendanceMap = () => {
    const map = {};
    attendanceHistory.forEach((entry) => {
      const key = new Date(entry.timestamp).toDateString();
      if (!map[key]) map[key] = { checkin: false, checkout: false };
      if (entry.type === "check-in") map[key].checkin = true;
      if (entry.type === "check-out") map[key].checkout = true;
    });
    return map;
  };

  const getAttendanceStatus = (date) => {
    const map = getAttendanceMap();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return null;
    const record = map[date.toDateString()];
    if (record?.checkin && record?.checkout) return "present";
    if (record?.checkin && !record?.checkout) return "partial";
    if (!record) return "absent";
    return null;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_ENDPOINTS.createEvent, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (data.success) {
        setShowEventForm(false);
        setNewEvent({
          title: "",
          description: "",
          eventType: "meeting",
          startDate: "",
          endDate: "",
          isAllDay: false,
          location: "",
          color: "#0078d4",
        });
        fetchEvents();
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(API_ENDPOINTS.deleteEvent(eventId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const prevMonthLast = new Date(year, month, 0).getDate();

    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLast - i),
        inMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), inMonth: true });
    }

    while (days.length % 7 !== 0) {
      days.push({
        date: new Date(year, month + 1, days.length % 7),
        inMonth: false,
      });
    }

    return days;
  };

  const getEventsForDate = (date) =>
    events.filter(
      (event) => new Date(event.startDate).toDateString() === date.toDateString()
    );

  const getTimesheetEntriesForDate = (date) => {
    return timesheetEntries.filter((entry) => {
      const entryDate = entry.startTime?.includes('T') 
        ? entry.startTime.split('T')[0] 
        : entry.startTime;
      const dateStr = date.toISOString().split('T')[0];
      return entryDate === dateStr;
    });
  };

  const formatTimeEntry = (entry) => {
    const startTime = entry.startTime?.includes('T') 
      ? entry.startTime.split('T')[1]?.substring(0, 5) 
      : entry.startTime;
    const endTime = entry.endTime?.includes('T') 
      ? entry.endTime.split('T')[1]?.substring(0, 5) 
      : entry.endTime;
    
    if (!startTime || !endTime) return '';
    
    return `${startTime} - ${endTime}`;
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = startTime.includes('T') ? startTime.split('T')[1]?.substring(0, 5) : startTime;
    const end = endTime.includes('T') ? endTime.split('T')[1]?.substring(0, 5) : endTime;
    
    if (!start || !end) return 0;
    
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return (endMinutes - startMinutes) / 60;
  };

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = getDaysInMonth(currentDate);

  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  return (
    <div className="attendance-app calendar-page">
      <div className="ms-panel calendar-hero">
        <div>
          <p className="eyebrow">Schedule</p>
          <h1>My calendar</h1>
          <p className="support">
            Plan meetings, track leave, and monitor attendance health with calm
            clarity.
          </p>
        </div>
        <button className="ms-btn primary" onClick={() => setShowEventForm(true)}>
          <FiPlus /> Add event
        </button>
      </div>

      <div className="calendar-layout">
        <section className="ms-panel calendar-board">
          <header className="board-header">
            <button type="button" onClick={() => changeMonth(-1)}>
              ‹
            </button>
            <div className="month-title">
              <FiCalendar /> {monthYear}
            </div>
            <button type="button" onClick={() => changeMonth(1)}>
              ›
            </button>
          </header>

          <div className="weekday-row">
            {WEEKDAY_LABELS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-cells">
            {days.map(({ date, inMonth }) => {
              const dayEvents = getEventsForDate(date);
              const dayTimesheetEntries = inMonth ? getTimesheetEntriesForDate(date) : [];
              const attendanceState = inMonth ? getAttendanceStatus(date) : null;
              const classes = ["calendar-cell"];
              if (!inMonth) classes.push("is-out");
              if (isToday(date)) classes.push("is-today");
              if (attendanceState === "present") classes.push("attend-ok");
              if (attendanceState === "partial") classes.push("attend-partial");
              if (attendanceState === "absent") classes.push("attend-miss");
              
              // Calculate total hours for the day
              const totalHours = dayTimesheetEntries.reduce((sum, entry) => 
                sum + calculateHours(entry.startTime, entry.endTime), 0
              );
              
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={classes.join(" ")}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="day-number">{date.getDate()}</span>
                  {attendanceState && (
                    <span className="attendance-chip">{attendanceState}</span>
                  )}
                  <div className="events">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        key={event._id}
                        className="event-pill"
                        style={{ background: event.color }}
                      >
                        {EVENT_TYPES.find((t) => t.value === event.eventType)?.icon ??
                          "📌"}{" "}
                        {event.title}
                      </span>
                    ))}
                    {dayTimesheetEntries.length > 0 && (
                      <div className="timesheet-entries">
                        {dayTimesheetEntries.slice(0, 2).map((entry) => (
                          <span
                            key={entry._id}
                            className="timesheet-pill"
                            title={`${entry.notes || entry.description || 'Timesheet'}: ${formatTimeEntry(entry)}`}
                          >
                            ⏱️ {entry.notes || entry.description || 'Time Entry'}
                          </span>
                        ))}
                        {dayTimesheetEntries.length > 2 && (
                          <span className="more-pill">+{dayTimesheetEntries.length - 2}</span>
                        )}
                        {totalHours > 0 && (
                          <span className="hours-badge">
                            {Math.floor(totalHours)}h{Math.round((totalHours - Math.floor(totalHours)) * 60)}m
                          </span>
                        )}
                      </div>
                    )}
                    {dayEvents.length > 2 && (
                      <span className="more-pill">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="calendar-side">
          <div className="ms-panel">
            <div className="panel-title">
              <FiClock /> Upcoming events
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="empty">Nothing scheduled yet</p>
            ) : (
              <div className="event-stack">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="event-card">
                    <div>
                      <h4>
                        {EVENT_TYPES.find((t) => t.value === event.eventType)?.icon ??
                          "📌"}{" "}
                        {event.title}
                      </h4>
                      <p>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {event.location && (
                        <p className="location">
                          <FiMapPin /> {event.location}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="plain-link danger"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ms-panel legend">
            <h4>Attendance status</h4>
            <ul>
              <li>
                <span className="dot present" /> Present
              </li>
              <li>
                <span className="dot partial" /> Partial
              </li>
              <li>
                <span className="dot absent" /> Absent
              </li>
            </ul>
          </div>

          <div className="ms-panel legend">
            <h4>Event types</h4>
            <ul>
              {EVENT_TYPES.map((type) => (
                <li key={type.value}>
                  {type.icon} {type.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {showEventForm && (
        <div className="ms-modal-overlay">
          <div className="ms-modal-panel calendar-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">New entry</p>
                <h3>Create event</h3>
              </div>
              <button
                type="button"
                className="plain-link"
                onClick={() => setShowEventForm(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="form-grid">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="input"
                required
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="input"
                rows="3"
              />
              <div className="grid-2">
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                  className="input"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <input
                  type="color"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid-2">
                <div>
                  <label>Start date & time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label>End date & time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Location (optional)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="input"
              />
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={newEvent.isAllDay}
                  onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                />
                <span>All day event</span>
              </label>
              <footer className="modal-actions">
                <button
                  type="button"
                  className="ms-btn secondary"
                  onClick={() => setShowEventForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ms-btn primary">
                  Save event
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;

