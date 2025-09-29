import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import './HolidayModal.css';

const HolidayModal = ({ isOpen, onClose }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      fetchHolidays();
    }
  }, [isOpen]);

  const fetchHolidays = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getHolidays, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHolidays(response.data);
    } catch (err) {
      setError('Failed to fetch holidays');
      console.error('Error fetching holidays:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getPastHolidays = () => {
    const today = new Date();
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate < today;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getHolidayIcon = (holidayName) => {
    const name = holidayName.toLowerCase();
    if (name.includes('christmas') || name.includes('xmas')) return '🎄';
    if (name.includes('new year') || name.includes('year')) return '🎊';
    if (name.includes('diwali') || name.includes('deepavali')) return '🪔';
    if (name.includes('holi')) return '🌈';
    if (name.includes('eid')) return '🌙';
    if (name.includes('ganesh')) return '🐘';
    if (name.includes('durga')) return '⚔️';
    if (name.includes('independence')) return '🇮🇳';
    if (name.includes('republic')) return '🏛️';
    if (name.includes('gandhi')) return '🕊️';
    if (name.includes('labor') || name.includes('labour')) return '⚒️';
    if (name.includes('valentine')) return '💖';
    if (name.includes('pongal')) return '🌾';
    if (name.includes('ugadi')) return '🌸';
    if (name.includes('tamil')) return '📚';
    if (name.includes('saturday')) return '📅';
    return '🎉';
  };

  if (!isOpen) return null;

  const upcomingHolidays = getUpcomingHolidays();
  const pastHolidays = getPastHolidays();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="holiday-modal bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/30 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Holiday Calendar</h2>
              <p className="text-white drop-shadow text-sm mt-1">
                View upcoming and past holidays for the year
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600">Loading holidays...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Holidays</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchHolidays}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Holidays Section */}
              {upcomingHolidays.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Upcoming Holidays</h3>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {upcomingHolidays.length} holidays
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingHolidays.map((holiday, index) => {
                      const daysUntil = getDaysUntil(holiday.date);
                      return (
                        <div
                          key={holiday._id}
                          className="holiday-card upcoming group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{getHolidayIcon(holiday.name)}</div>
                              <div className="flex flex-col">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                                  #{String(index + 1).padStart(2, '0')}
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200">
                                  {holiday.name}
                                </h4>
                              </div>
                            </div>
                            {daysUntil === 0 ? (
                              <div className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                TODAY
                              </div>
                            ) : daysUntil === 1 ? (
                              <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                                TOMORROW
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                {daysUntil} days
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{formatDate(holiday.date)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Holidays Section */}
              {pastHolidays.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Past Holidays</h3>
                    <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {pastHolidays.length} holidays
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastHolidays.slice(0, 9).map((holiday, index) => (
                      <div
                        key={holiday._id}
                        className="holiday-card past bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl opacity-60">{getHolidayIcon(holiday.name)}</div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-700">
                              {holiday.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(holiday.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {pastHolidays.length > 9 && (
                    <div className="text-center mt-4">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <span>And {pastHolidays.length - 9} more past holidays</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {holidays.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Holidays Found</h3>
                  <p className="text-gray-500">There are currently no holidays configured in the system.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Total Holidays: <span className="font-semibold text-gray-800">{holidays.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayModal;