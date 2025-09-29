import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AttendancePage.css";
import { useNavigate, useParams } from "react-router-dom";

import { API_ENDPOINTS } from "../../utils/api";
import ProfileHeader from "../../components/attendance/ProfileHeader";
import DateStrip from "../../components/attendance/DateStrip";
import AttendanceCards from "../../components/attendance/AttendanceCards";
import ActivityLog from "../../components/attendance/ActivityLog";
import CameraView from "../../components/attendance/CameraView";
import { compressImage } from "../../components/attendance/utils";
import TimesheetModal from "../../components/timesheet/TimesheetModal";

function AttendancePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isSelf = !userId;

  const [user, setUser] = useState({ name: "", position: "", company: "" });
  const [type, setType] = useState(null);
  const [image, setImage] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [capturedTime, setCapturedTime] = useState(null);
  const [location, setLocation] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, +1 = next week

  const videoRef = useRef(null);
  const streamRef = useRef(null);

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

  const calculateWeeklyHours = useCallback(() => {
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

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        isSelf
          ? API_ENDPOINTS.getCurrentUser
          : API_ENDPOINTS.getUserById(userId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({
        name: res.data.name,
        position: res.data.position,
        company: res.data.company,
      });
    } catch (err) {
      // Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to load user info' });
    }
  }, [isSelf, userId]);

  const fetchAttendance = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        isSelf
          ? API_ENDPOINTS.getMyAttendance
          : API_ENDPOINTS.getAttendanceByUser(userId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceHistory(res.data);

      const today = new Date().toDateString();
      const todayEntries = res.data.filter(
        (entry) => new Date(entry.timestamp).toDateString() === today
      );

      if (isSelf) {
        if (todayEntries.length === 0) {
          setType("check-in");
        } else if (
          todayEntries.length === 1 &&
          todayEntries[0].type === "check-in"
        ) {
          setType("check-out");
        } else {
          setType(null);
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load attendance data",
      });
    }
  }, [isSelf, userId]);

  useEffect(() => {
    fetchUser();
    fetchAttendance();
  }, [fetchUser, fetchAttendance]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
      () =>
        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: "Please enable GPS to proceed.",
        })
    );
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Camera Access Denied",
        text: "Please enable your camera and refresh the page.",
      });
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const file = new File([blob], "attendance.jpg", { type: "image/jpeg" });
        const compressed = await compressImage(file);
        if (compressed) {
          setImage(URL.createObjectURL(compressed));
          setCompressedBlob(compressed);
          setCapturedTime(new Date());
          getLocation();
        } else {
          Swal.fire({ icon: "error", title: "Compression Failed" });
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const submitAttendance = async () => {
    if (isSubmitting) return;
    if (!compressedBlob || !location) {
      Swal.fire(
        "Missing Data",
        "Ensure image and location are available before submitting.",
        "warning"
      );
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("location", location);
    formData.append("image", compressedBlob);

    try {
      setIsSubmitting(true); // start loading
      await axios.post(API_ENDPOINTS.postAttendance, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire(
        "Success",
        `${type === "check-in" ? "Checked In" : "Checked Out"} successfully`,
        "success"
      );
      setImage(null);
      setCompressedBlob(null);
      setLocation("");
      stopCamera();
      fetchAttendance();
    } catch (err) {
      Swal.fire("Failed", "Could not submit attendance", "error");
    } finally {
      setIsSubmitting(false); // stop loading
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const attendanceMap = {};
  attendanceHistory.forEach((entry) => {
    const dateKey = new Date(entry.timestamp).toDateString();
    if (!attendanceMap[dateKey])
      attendanceMap[dateKey] = { checkin: false, checkout: false };
    if (entry.type === "check-in") attendanceMap[dateKey].checkin = true;
    if (entry.type === "check-out") attendanceMap[dateKey].checkout = true;
  });

  const filteredLogs = attendanceHistory.filter(
    (entry) =>
      new Date(entry.timestamp).toDateString() === selectedDate.toDateString()
  );

  const presentDays = Object.keys(attendanceMap).length;
  const currentDayOfMonth = new Date().getDate(); // Today's date (29)
  const absentDays = currentDayOfMonth - presentDays; // Only count days up to today

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-green-50 px-4 py-6 md:py-10 w-full font-sans">
      
      {/* Light Multi-Color Action Controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between items-stretch lg:items-center gap-6 mb-8 px-2 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
          <button
            onClick={() => setShowTimesheetModal(true)}
            className="group relative overflow-hidden bg-white hover:bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl border border-emerald-200/60 transition-all duration-300 text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Add Timesheet</span>
            </span>
          </button>
          
          <button
            onClick={() => navigate("/apply-leave")}
            className="group relative overflow-hidden bg-white hover:bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl border border-green-200/60 transition-all duration-300 text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span>Apply Leave</span>
            </span>
          </button>
          
          <button
            onClick={() => navigate("/task-manager")}
            className="group relative overflow-hidden bg-white hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl border border-blue-200/60 transition-all duration-300 text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span>Task Manager</span>
            </span>
          </button>
          
          <button
            onClick={() => setShowCalendarModal(true)}
            className="group relative overflow-hidden bg-white hover:bg-orange-50 text-orange-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl border border-orange-200/60 transition-all duration-300 text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Calendar View</span>
            </span>
          </button>
        </div>
        
        <button
          onClick={onLogout}
          className="group relative overflow-hidden bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto text-sm sm:text-base"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <div className="p-1.5 bg-pink-300/50 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span>Logout</span>
          </span>
        </button>
      </div>

      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="glass rounded-3xl shadow-2xl max-w-md w-full mx-4 relative elevation-4 border border-white/20">
            <button
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              onClick={() => setShowCalendarModal(false)}
            >
              ✕
            </button>
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  Attendance Calendar
                </h2>
                <p className="text-slate-600">
                  {calendarViewDate.toLocaleString("default", { month: "long" })} {calendarViewDate.getFullYear()}
                </p>
              </div>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                onActiveStartDateChange={({ activeStartDate }) =>
                  setCalendarViewDate(activeStartDate)
                }
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const key = date.toDateString();
                    const record = attendanceMap[key];
                    if (record?.checkin && record?.checkout) return "present-day";
                    if (record?.checkin && !record?.checkout)
                      return "partial-present";
                    if (!record) return "absent-day";
                  }
                  return "";
                }}
                className="w-full rounded-2xl border-none shadow-inner"
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-100">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-semibold text-green-700">Present</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-yellow-100">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-semibold text-yellow-700">Partial</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-red-100">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-semibold text-red-700">Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ProfileHeader
        name={user.name}
        position={user.position}
        company={user.company}
      />

       {/* Light Multi-Color Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Present Days</span>
          </div>
          <p className="text-3xl font-bold text-green-800 mb-2">{presentDays}</p>
          <div className="w-full bg-green-200 h-1.5 rounded-full">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full transition-all duration-500" 
              style={{width: `${(presentDays / currentDayOfMonth) * 100}%`}}
            ></div>
          </div>
          <p className="text-xs text-green-600 mt-2">Days Attended</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-orange-700 uppercase tracking-wide">Absent Days</span>
          </div>
          <p className="text-3xl font-bold text-orange-800 mb-2">{absentDays}</p>
          <div className="w-full bg-orange-200 h-1.5 rounded-full">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 rounded-full transition-all duration-500" 
              style={{width: `${(absentDays / currentDayOfMonth) * 100}%`}}
            ></div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Days Missed</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Days</span>
          </div>
          <p className="text-3xl font-bold text-blue-800 mb-2">{currentDayOfMonth}</p>
          <div className="w-full bg-blue-200 h-1.5 rounded-full">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full w-full"></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Month Progress</p>
        </div>
      </div>

      {/* Light Multi-Color Weekly Analytics */}
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

        {/* Light Multi-Color Metrics Grid */}
        <div className="grid grid-cols-4 gap-6">
          {/* Expected Hours */}
          <div className="bg-cyan-50/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-cyan-600 uppercase tracking-wide">Expected Hours</div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-cyan-800 mb-2">
              {(() => {
                const { workingDays } = calculateWeeklyHours();
                const expectedHours = Math.max(workingDays * 8, 40);
                return `${expectedHours}.00`;
              })()}
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
              {(() => {
                const { totalWorkedHours } = calculateWeeklyHours();
                const hours = Math.floor(totalWorkedHours);
                const minutes = Math.floor((totalWorkedHours - hours) * 60);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              })()}
            </div>
            <div className="w-full bg-emerald-200 h-1 rounded-full">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1 rounded-full transition-all duration-500" 
                style={{
                  width: `${Math.min((calculateWeeklyHours().totalWorkedHours / 40) * 100, 100)}%`
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
                {(() => {
                  const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                  const expectedHours = Math.max(workingDays * 8, 40);
                  const efficiency = Math.min((totalWorkedHours / expectedHours) * 100, 100);
                  return Math.round(efficiency);
                })()}%
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
                      const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                      const expectedHours = Math.max(workingDays * 8, 40);
                      const efficiency = Math.min((totalWorkedHours / expectedHours) * 100, 100);
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
                  width: `${(() => {
                    const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                    const expectedHours = Math.max(workingDays * 8, 40);
                    return Math.min((totalWorkedHours / expectedHours) * 100, 100);
                  })()}%`
                }}
              ></div>
            </div>
            <div className="text-xs text-amber-600 mt-2">Performance Ratio</div>
          </div>

          {/* Performance Status */}
          <div className="bg-violet-50/80 backdrop-blur-sm rounded-2xl p-4 border border-violet-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-violet-600 uppercase tracking-wide">Status</div>
              <div className={`w-2 h-2 rounded-full ${
                (() => {
                  const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                  const expectedHours = Math.max(workingDays * 8, 40);
                  const efficiency = (totalWorkedHours / expectedHours) * 100;
                  
                  if (efficiency >= 90) return 'bg-violet-600';
                  if (efficiency >= 75) return 'bg-violet-500';
                  return 'bg-violet-400';
                })()
              }`}></div>
            </div>
            <div className="text-lg font-semibold text-violet-800 mb-2">
              {(() => {
                const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                const expectedHours = Math.max(workingDays * 8, 40);
                const efficiency = (totalWorkedHours / expectedHours) * 100;
                
                if (efficiency >= 90) return 'Excellent';
                if (efficiency >= 75) return 'Good';
                if (efficiency >= 50) return 'Average';
                return 'Below Target';
              })()}
            </div>
            <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              (() => {
                const { totalWorkedHours, workingDays } = calculateWeeklyHours();
                const expectedHours = Math.max(workingDays * 8, 40);
                const efficiency = (totalWorkedHours / expectedHours) * 100;
                
                if (efficiency >= 90) return 'bg-violet-100 text-violet-700';
                if (efficiency >= 75) return 'bg-violet-100 text-violet-600';
                return 'bg-violet-100 text-violet-500';
              })()
            }`}>
              {currentWeekOffset === 0 ? 'This Week' : currentWeekOffset < 0 ? `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ago` : `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead`}
            </div>
            <div className="text-xs text-violet-600 mt-1">Current Period</div>
          </div>
        </div>
      </div>

      {/* Monthly Effort Tracker */}
      <div className="mb-6">
        <DateStrip
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          attendanceHistory={attendanceHistory}
        />
      </div>

      {/* Today's Attendance Analytics */}
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
        <AttendanceCards attendanceData={attendanceHistory} />
        <div className="mt-6">
          <ActivityLog activities={filteredLogs} />
        </div>
      </div>
      {isSelf && type && !isCapturing && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => {
              getLocation();
              startCamera();
            }}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 hover:from-emerald-500 hover:via-cyan-500 hover:to-sky-500 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ripple elevation-4"
          >
            <span className="relative z-10 flex items-center gap-2">
              {type === "check-in" ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Check In
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7 8.586 5.707 7.293a1 1 0 00-1.414 1.414L6.586 11l-2.293 2.293a1 1 0 101.414 1.414L8 12.414l2.293 2.293a1 1 0 001.414-1.414L9.414 11l2.293-2.293z" clipRule="evenodd" />
                  </svg>
                  Check Out
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      )}

      {isCapturing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass w-full max-w-sm rounded-3xl shadow-2xl space-y-6 text-center elevation-4 border border-white/20">
            <div className="p-6">
              {!image ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold gradient-text mb-2">Take Attendance Photo</h3>
                    <p className="text-sm text-slate-600">Position your face in the center</p>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-inner mb-6">
                    <CameraView ref={videoRef} />
                    <div className="absolute inset-0 border-4 border-white/30 rounded-2xl pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-500 rounded-full pointer-events-none animate-pulse"></div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple shadow-lg"
                    >
                      📸 Capture
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold gradient-text mb-2">Confirm Photo</h3>
                    <p className="text-sm text-slate-600">Review your attendance photo</p>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
                    <img
                      src={image}
                      alt="Captured"
                      className="rounded-2xl w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                  {capturedTime && (
                    <div className="glass rounded-xl p-4 mb-6 text-sm text-slate-600 space-y-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-slate-700">Capture Details</span>
                      </div>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {capturedTime.toLocaleTimeString()}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {capturedTime.toLocaleDateString()}
                      </p>
                      {location && (
                        <p>
                          <span className="font-medium">Location:</span> {location}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(image);
                        setImage(null);
                        setCompressedBlob(null);
                        startCamera();
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple"
                    >
                      🔄 Retake
                    </button>
                    <button
                      onClick={submitAttendance}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple shadow-lg ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        `✨ Submit ${
                          type === "check-in" ? "Check In" : "Check Out"
                        }`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Modal */}
      <TimesheetModal
        isOpen={showTimesheetModal}
        onClose={() => setShowTimesheetModal(false)}
      />
    </div>
  );
}

export default AttendancePage;
