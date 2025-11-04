import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiTrash2, FiEdit, FiClock, FiMapPin } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import axios from 'axios';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'meeting',
    startDate: '',
    endDate: '',
    isAllDay: false,
    location: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    fetchEvents();
    fetchAttendance();
  }, [currentDate]);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.getUserEvents, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API_ENDPOINTS.getMyAttendance, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Build attendance map for quick lookup
  const getAttendanceMap = () => {
    const attendanceMap = {};
    attendanceHistory.forEach((entry) => {
      const dateKey = new Date(entry.timestamp).toDateString();
      if (!attendanceMap[dateKey]) {
        attendanceMap[dateKey] = { checkin: false, checkout: false };
      }
      if (entry.type === 'check-in') attendanceMap[dateKey].checkin = true;
      if (entry.type === 'check-out') attendanceMap[dateKey].checkout = true;
    });
    return attendanceMap;
  };

  // Get attendance status for a date
  const getAttendanceStatus = (date) => {
    const attendanceMap = getAttendanceMap();
    const key = date.toDateString();
    const record = attendanceMap[key];
    
    // Don't show status for future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return null;
    
    if (record?.checkin && record?.checkout) return 'present';
    if (record?.checkin && !record?.checkout) return 'partial';
    if (!record) return 'absent';
    return null;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.createEvent, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowEventForm(false);
        setNewEvent({
          title: '',
          description: '',
          eventType: 'meeting',
          startDate: '',
          endDate: '',
          isAllDay: false,
          location: '',
          color: '#3b82f6'
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      await fetch(API_ENDPOINTS.deleteEvent(eventId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'training': return '📚';
      case 'deadline': return '⏰';
      case 'birthday': return '🎂';
      case 'anniversary': return '🎉';
      case 'holiday': return '🏖️';
      default: return '📌';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-xl text-white">
                <FiCalendar className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Calendar</h1>
                <p className="text-gray-600">Manage your schedule and events 📅</p>
              </div>
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <FiPlus /> Add Event
            </button>
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="border rounded-lg px-4 py-3 w-full"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="border rounded-lg px-4 py-3 w-full"
                  rows="3"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="border rounded-lg px-4 py-3"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                    <option value="deadline">Deadline</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                    className="border rounded-lg px-4 py-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      className="border rounded-lg px-4 py-3 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      className="border rounded-lg px-4 py-3 w-full"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="border rounded-lg px-4 py-3 w-full"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEvent.isAllDay}
                    onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">All Day Event</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex-1"
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeMonth(-1)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  ← Prev
                </button>
                <h2 className="text-2xl font-bold">{monthYear}</h2>
                <button
                  onClick={() => changeMonth(1)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((dayInfo, index) => {
                const dayEvents = getEventsForDate(dayInfo.date);
                const isTodayDate = isToday(dayInfo.date);
                const attendanceStatus = dayInfo.isCurrentMonth ? getAttendanceStatus(dayInfo.date) : null;
                
                // Get background color based on attendance
                let dayBgClass = '';
                if (dayInfo.isCurrentMonth) {
                  if (attendanceStatus === 'present') {
                    dayBgClass = 'bg-green-200 border-green-400';
                  } else if (attendanceStatus === 'partial') {
                    dayBgClass = 'bg-yellow-200 border-yellow-400';
                  } else if (attendanceStatus === 'absent') {
                    dayBgClass = 'bg-red-200 border-red-400';
                  } else if (isTodayDate) {
                    dayBgClass = 'bg-blue-100 border-blue-500';
                  } else {
                    dayBgClass = 'bg-white border-gray-100';
                  }
                } else {
                  dayBgClass = 'bg-gray-50 border-gray-100';
                }
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border cursor-pointer transition-all hover:shadow-md ${dayBgClass} ${
                      !dayInfo.isCurrentMonth ? 'text-gray-400' : ''
                    } ${isTodayDate && attendanceStatus === null ? 'ring-2 ring-blue-300' : ''}`}
                    onClick={() => setSelectedDate(dayInfo.date)}
                  >
                    <div className={`font-semibold mb-1 ${
                      isTodayDate ? 'text-blue-600' : 
                      attendanceStatus === 'present' ? 'text-green-800' :
                      attendanceStatus === 'partial' ? 'text-yellow-800' :
                      attendanceStatus === 'absent' ? 'text-red-800' : 
                      'text-gray-700'
                    }`}>
                      {dayInfo.day}
                    </div>
                    <div className="space-y-1">
                      {attendanceStatus && dayInfo.isCurrentMonth && (
                        <div className={`text-xs px-1.5 py-0.5 rounded text-center font-medium ${
                          attendanceStatus === 'present' ? 'bg-green-500 text-white' :
                          attendanceStatus === 'partial' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {attendanceStatus === 'present' ? '✓' : attendanceStatus === 'partial' ? '~' : '✗'}
                        </div>
                      )}
                      {dayEvents.slice(0, attendanceStatus ? 1 : 2).map((event, i) => (
                        <div
                          key={i}
                          className="text-xs px-2 py-1 rounded truncate text-white"
                          style={{ backgroundColor: event.color }}
                          title={event.title}
                        >
                          {getEventTypeIcon(event.eventType)} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > (attendanceStatus ? 1 : 2) && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - (attendanceStatus ? 1 : 2)} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiClock /> Upcoming Events
              </h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="border-l-4 p-3 rounded bg-gray-50 hover:shadow-md transition-shadow"
                      style={{ borderColor: event.color }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          {getEventTypeIcon(event.eventType)} {event.title}
                        </h4>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FiMapPin size={12} /> {event.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Attendance Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-700">Present</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-yellow-700">Partial</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-red-700">Absent</span>
                </div>
              </div>
            </div>

            {/* Event Types Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Event Types</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">👥 Meeting</div>
                <div className="flex items-center gap-2">📚 Training</div>
                <div className="flex items-center gap-2">⏰ Deadline</div>
                <div className="flex items-center gap-2">🎂 Birthday</div>
                <div className="flex items-center gap-2">🎉 Anniversary</div>
                <div className="flex items-center gap-2">🏖️ Holiday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

