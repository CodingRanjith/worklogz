import React, { useState, useCallback, useMemo } from 'react';

const WeeklyHours = ({ attendanceHistory }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, +1 = next week

  // Dynamic week calculation functions
  const getCurrentWeekDates = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + (currentWeekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { startOfWeek, endOfWeek };
  }, [currentWeekOffset]);

  const calculateWeeklyHours = useMemo(() => {
    const { startOfWeek, endOfWeek } = getCurrentWeekDates();
    
    let totalWorkedHours = 0;
    let workingDays = 0;
    
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toDateString();
      const dayEntries = attendanceHistory.filter(e => 
        new Date(e.timestamp).toDateString() === dateKey
      );
      const checkIn = dayEntries.find(e => e.type === 'check-in');
      const checkOut = dayEntries.find(e => e.type === 'check-out');
      
      if (checkIn && checkOut) {
        const diff = new Date(checkOut.timestamp) - new Date(checkIn.timestamp);
        totalWorkedHours += diff / (1000 * 60 * 60);
        workingDays++;
      }
    }
    
    return { totalWorkedHours, workingDays };
  }, [attendanceHistory, getCurrentWeekDates]);

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const getExpectedHours = () => {
    const { workingDays } = calculateWeeklyHours;
    return Math.max(workingDays * 8, 40);
  };

  const getEfficiencyScore = () => {
    const { totalWorkedHours } = calculateWeeklyHours;
    const expectedHours = getExpectedHours();
    return Math.min((totalWorkedHours / expectedHours) * 100, 100);
  };

  const getPerformanceStatus = () => {
    const efficiency = getEfficiencyScore();
    
    if (efficiency >= 90) return { status: 'Excellent', color: 'bg-violet-600' };
    if (efficiency >= 75) return { status: 'Good', color: 'bg-violet-500' };
    if (efficiency >= 50) return { status: 'Average', color: 'bg-violet-400' };
    return { status: 'Below Target', color: 'bg-violet-400' };
  };

  const getStatusColorClass = () => {
    const efficiency = getEfficiencyScore();
    
    if (efficiency >= 90) return 'bg-violet-100 text-violet-700';
    if (efficiency >= 75) return 'bg-violet-100 text-violet-600';
    return 'bg-violet-100 text-violet-500';
  };

  const formatWorkTime = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getWeekPeriodText = () => {
    if (currentWeekOffset === 0) return 'This Week';
    if (currentWeekOffset < 0) {
      const weeks = Math.abs(currentWeekOffset);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    return `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">Weekly Performance</h3>
            <p className="text-sm text-indigo-600">Track your weekly productivity metrics</p>
          </div>
        </div>
        
        {/* Week Navigation Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-xs font-medium text-purple-600 mb-1">Week Period</div>
              <div className="text-sm font-semibold text-purple-800">
                {(() => {
                  const { startOfWeek, endOfWeek } = getCurrentWeekDates();
                  return `${startOfWeek.toLocaleDateString('en-GB')} - ${endOfWeek.toLocaleDateString('en-GB')}`;
                })()}
              </div>
            </div>
          </div>
          
          <button 
            onClick={goToNextWeek}
            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {currentWeekOffset !== 0 && (
            <button
              onClick={goToCurrentWeek}
              className="ml-2 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-colors duration-200"
            >
              Current Week
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Expected Hours */}
        <div className="bg-cyan-50/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-cyan-600 uppercase tracking-wide">Expected Hours</div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-cyan-800 mb-2">
            {getExpectedHours()}.00
          </div>
          <div className="w-full bg-cyan-200 h-1 rounded-full">
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-400 h-1 rounded-full w-full"></div>
          </div>
          <div className="text-xs text-cyan-600 mt-2">Standard Work Week</div>
        </div>

        {/* Worked Hours */}
        <div className="bg-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Worked Hours</div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-emerald-800 mb-2">
            {formatWorkTime(calculateWeeklyHours.totalWorkedHours)}
          </div>
          <div className="w-full bg-emerald-200 h-1 rounded-full">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1 rounded-full transition-all duration-500" 
              style={{
                width: `${Math.min((calculateWeeklyHours.totalWorkedHours / 40) * 100, 100)}%`
              }}
            ></div>
          </div>
          <div className="text-xs text-emerald-600 mt-2">Actual Time Logged</div>
        </div>

        {/* Efficiency Score */}
        <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">Efficiency</div>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-amber-800">
              {Math.round(getEfficiencyScore())}%
            </div>
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="#fef3c7"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${(() => {
                    const efficiency = getEfficiencyScore();
                    const circumference = 2 * Math.PI * 14;
                    const strokeDasharray = (efficiency / 100) * circumference;
                    return strokeDasharray;
                  })()} ${2 * Math.PI * 14}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
          <div className="w-full bg-amber-200 h-1 rounded-full">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-1 rounded-full transition-all duration-500" 
              style={{
                width: `${getEfficiencyScore()}%`
              }}
            ></div>
          </div>
          <div className="text-xs text-amber-600 mt-2">Performance Ratio</div>
        </div>

        {/* Performance Status */}
        <div className="bg-violet-50/80 backdrop-blur-sm rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-violet-600 uppercase tracking-wide">Status</div>
            <div className={`w-2 h-2 rounded-full ${getPerformanceStatus().color}`}></div>
          </div>
          <div className="text-lg font-semibold text-violet-800 mb-2">
            {getPerformanceStatus().status}
          </div>
          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass()}`}>
            {getWeekPeriodText()}
          </div>
          <div className="text-xs text-violet-600 mt-1">Current Period</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHours;
