import React from 'react';

function formatTime(timestamp) {
  if (!timestamp) return '--:--';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AttendanceCards({ attendanceData = [] }) {
  if (!attendanceData.length) return null;

  // Group attendance by date
  const grouped = attendanceData.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  // Get latest date
  const latestDate = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))[0];
  const latestEntries = grouped[latestDate] || [];

  const checkIn = latestEntries.find(entry => entry.type === 'check-in');
  const checkOut = latestEntries.find(entry => entry.type === 'check-out');

  // Calculate break time (placeholder logic)
  const calculateBreakTime = () => {
    // You can implement actual break time calculation here
    return '00:40 min';
  };

  const cards = [
    {
      title: 'Check In',
      time: formatTime(checkIn?.timestamp),
      note: checkIn ? 'On Time' : 'Not Yet',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200', 
      textColor: 'text-green-800',
      titleColor: 'text-green-700',
      timeColor: 'text-green-900',
    },
    {
      title: 'Check Out',
      time: formatTime(checkOut?.timestamp),
      note: checkOut ? 'Go Home' : 'Not Yet',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-700',
      timeColor: 'text-blue-900',
    },
    {
      title: 'Break Time',
      time: calculateBreakTime(),
      note: 'Avg Time 30 min',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-700',
      timeColor: 'text-yellow-900',
    },
    {
      title: 'Total Days',
      time: Object.keys(grouped).length.toString(),
      note: 'Working Days',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      textColor: 'text-purple-800',
      titleColor: 'text-purple-700',
      timeColor: 'text-purple-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${card.titleColor}`}>{card.title}</p>
            {/* Optional: Add icons here */}
          </div>
          <h4 className={`text-2xl font-bold mb-1 ${card.timeColor}`}>{card.time}</h4>
          <p className={`text-xs font-medium ${card.textColor} opacity-75`}>{card.note}</p>
        </div>
      ))}
    </div>
  );
}

export default AttendanceCards;
