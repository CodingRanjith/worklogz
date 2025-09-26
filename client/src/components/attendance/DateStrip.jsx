import React from 'react';

function DateStrip({ selectedDate, setSelectedDate }) {
  const today = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get current month and year
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate all days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return {
      date: d,
      day: d.getDate().toString().padStart(2, '0'),
      label: dayLabels[d.getDay()],
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.toDateString(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6, // Sunday or Saturday
    };
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((d, i) => (
        <button
          key={i}
          onClick={() => setSelectedDate(d.date)}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border shadow-sm min-w-[55px] transition-all
            ${d.isSelected
              ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
              : d.isToday
                ? 'bg-green-50 border-green-500 text-green-700 font-medium'
                : d.isWeekend
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="text-base">{d.day}</span>
          <span className="text-xs font-medium">{d.label}</span>
          {d.isToday && !d.isSelected && (
            <span className="mt-1 w-1.5 h-1.5 bg-green-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

export default DateStrip;
