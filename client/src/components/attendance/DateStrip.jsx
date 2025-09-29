import React, { useState, useMemo } from 'react';

function DateStrip({ selectedDate, setSelectedDate, attendanceHistory = [] }) {
  const today = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  // State for current viewing month/year
  const [viewingMonth, setViewingMonth] = useState(today.getMonth());
  const [viewingYear, setViewingYear] = useState(today.getFullYear());
  
  // Calculate work hours for each day from attendance history
  const dailyWorkHours = useMemo(() => {
    const hoursMap = {};
    
    // Group attendance by date
    const attendanceByDate = attendanceHistory.reduce((acc, entry) => {
      const dateKey = new Date(entry.timestamp).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(entry);
      return acc;
    }, {});

    // Calculate work hours for each date
    Object.entries(attendanceByDate).forEach(([dateKey, entries]) => {
      const checkIn = entries.find(e => e.type === 'check-in');
      const checkOut = entries.find(e => e.type === 'check-out');
      
      if (checkIn && checkOut) {
        const diff = new Date(checkOut.timestamp) - new Date(checkIn.timestamp);
        const hours = diff / (1000 * 60 * 60); // Convert to hours
        hoursMap[dateKey] = hours;
      } else if (checkIn) {
        // Only check-in, assume minimal hours or 0
        hoursMap[dateKey] = 0;
      }
    });

    return hoursMap;
  }, [attendanceHistory]);

  // Calculate total effort for the viewing month
  const totalEffort = useMemo(() => {
    const monthStart = new Date(viewingYear, viewingMonth, 1);
    const monthEnd = new Date(viewingYear, viewingMonth + 1, 0);
    
    let total = 0;
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toDateString();
      total += dailyWorkHours[dateKey] || 0;
    }
    
    const hours = Math.floor(total);
    const minutes = Math.floor((total - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }, [dailyWorkHours, viewingMonth, viewingYear]);

  // Get number of days in viewing month
  const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();

  // Generate all days for the viewing month
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(viewingYear, viewingMonth, i + 1);
    const dateKey = d.toDateString();
    const workHours = dailyWorkHours[dateKey] || 0;
    
    return {
      date: d,
      day: d.getDate(),
      label: dayLabels[d.getDay()],
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.toDateString(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      workHours: workHours,
      formattedHours: workHours > 0 ? `${Math.floor(workHours)}:${Math.floor((workHours % 1) * 60).toString().padStart(2, '0')}` : '0',
      isFuture: d > today
    };
  });

  // Navigation functions
  const navigateMonth = (direction) => {
    let newMonth = viewingMonth + direction;
    let newYear = viewingYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setViewingMonth(newMonth);
    setViewingYear(newYear);
  };

  const getWorkHoursStyle = (hours, isFuture, isWeekend) => {
    if (isFuture) return 'bg-purple-100 text-purple-400 border border-purple-200';
    if (isWeekend) return 'bg-purple-200 text-purple-700 border border-purple-300';
    if (hours === 0) return 'bg-purple-100 text-purple-600 border border-purple-200';
    if (hours > 0 && hours < 4) return 'bg-purple-200 text-purple-700 border border-purple-300';
    if (hours >= 8) return 'bg-purple-600 text-white border border-purple-700';
    return 'bg-purple-300 text-purple-800 border border-purple-400';
  };

  const getDayBackgroundStyle = (day) => {
    const baseClasses = 'group relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm min-w-[76px] min-h-[90px] transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md';
    
    if (day.isSelected) {
      return `${baseClasses} bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-indigo-300 ring-opacity-50`;
    }
    
    if (day.isToday) {
      return `${baseClasses} bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 text-emerald-800 shadow-md ring-2 ring-emerald-200 ring-opacity-50`;
    }
    
    if (day.isFuture) {
      return `${baseClasses} bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed opacity-60`;
    }
    
    if (day.workHours === 0 && !day.isWeekend && !day.isFuture) {
      return `${baseClasses} bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100`;
    }
    
    if (day.workHours > 0) {
      const intensity = Math.min(day.workHours / 8, 1);
      if (intensity > 0.8) {
        return `${baseClasses} bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 text-emerald-800 hover:from-emerald-100 hover:to-green-100`;
      } else if (intensity > 0.5) {
        return `${baseClasses} bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-300 text-blue-800 hover:from-blue-100 hover:to-cyan-100`;
      } else {
        return `${baseClasses} bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 text-amber-800 hover:from-amber-100 hover:to-yellow-100`;
      }
    }
    
    if (day.isWeekend) {
      return `${baseClasses} bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 text-rose-700 hover:from-rose-100 hover:to-pink-100`;
    }
    
    return `${baseClasses} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/60 p-6 mb-6 hover:shadow-xl transition-all duration-300">
      {/* Header with navigation and title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              Monthly Effort Tracker
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full">
            <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold text-purple-800">{viewingYear}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 hover:text-purple-800 transition-all duration-300 shadow-sm hover:shadow-md"
            title="Previous Month"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 hover:text-purple-800 transition-all duration-300 shadow-sm hover:shadow-md"
            title="Next Month"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month tabs - Purple Theme */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {monthNames.map((month, index) => {
          const monthIndex = index <= 8 ? index + 3 : index - 9;
          const isActive = monthIndex === viewingMonth;
          
          return (
            <button
              key={month}
              onClick={() => setViewingMonth(monthIndex)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg ring-2 ring-purple-300 ring-opacity-50' 
                  : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 shadow-sm hover:shadow-md'
              }`}
            >
              {month}
            </button>
          );
        })}
      </div>

      {/* Days grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max py-2">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => !day.isFuture && setSelectedDate(day.date)}
              className={getDayBackgroundStyle(day)}
              disabled={day.isFuture}
            >
              <span className="text-xs font-semibold opacity-70 mb-1">{day.label}</span>
              <span className={`text-xl font-bold mb-2 ${day.isSelected ? 'text-white' : ''}`}>{day.day}</span>
              <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${getWorkHoursStyle(day.workHours, day.isFuture, day.isWeekend)}`}>
                {day.formattedHours}
              </div>
              {day.isToday && !day.isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse ring-2 ring-emerald-200"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Total effort display */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
            <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600 block">Total Effort</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {totalEffort} hrs
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-500">Progress</span>
              <span className="text-xs font-bold text-slate-700">
                {Math.round((parseFloat(totalEffort.replace(':', '.')) / 160) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${Math.min((parseFloat(totalEffort.replace(':', '.')) / 160) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateStrip;