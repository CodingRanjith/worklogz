import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../utils/api";
import HolidayModal from "../../components/holidays/HolidayModal";
import ProfileCard from "./ProfileCard";
import Swal from "sweetalert2";
import techLogo from "../../assets/tech.png";
import jobzenterLogo from "../../assets/tech.png";
import CameraView from "../../components/attendance/CameraView";
import { compressImage } from "../../components/attendance/utils";
import "./AttendancePage.css";
import "./AttendanceModern.css";
import "../../styles/m365Theme.css";

function HomePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isSelf = !userId;
  const [profileData, setProfileData] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  
  // Attendance check-in/check-out states
  const [type, setType] = useState(null);
  const [image, setImage] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [capturedTime, setCapturedTime] = useState(null);
  const [location, setLocation] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [workMode, setWorkMode] = useState("office");
  const [skipCamera, setSkipCamera] = useState(true);
  const [useLocation, setUseLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEmployeeId = (value) => {
    if (!value) return "";
    const clean = value.toString().trim();
    const match = clean.match(/^([A-Za-z]+)?\s*:?(\d+)$/);
    if (match) {
      const prefix = (match[1] || "EMP").toUpperCase();
      const digits = match[2].replace(/^0+/, '') || '0';
      const padded = digits.padStart(3, '0');
      return `${prefix}${padded}`;
    }
    return clean || "";
  };

  const getCompanyLogo = (company) => {
    if (!company) return techLogo;
    const companyLower = company.toLowerCase();
    if (companyLower === 'jobzenter') return jobzenterLogo;
    if (companyLower === 'techackode' || companyLower === 'urbancode') return techLogo;
    return techLogo;
  };

  const mapUserToProfile = (data) => ({
    id: data?._id || data?.id || "",
    name: data?.name || "",
    employeeId: formatEmployeeId(data?.employeeId || data?.employeeCode || ""),
    email: data?.email || "",
    phone: data?.phone || "",
    position: data?.position || "",
    department: data?.department || "",
    company: data?.company || "",
    location: data?.location || "",
    gender: data?.gender || "",
    dob: data?.dateOfBirth || "",
    maritalStatus: data?.maritalStatus || "",
    avatar: data?.profilePic || "",
    rolesAndResponsibility: data?.rolesAndResponsibility || [],
    qualification: data?.qualification || "",
    dateOfJoining: data?.dateOfJoining || "",
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        isSelf
          ? API_ENDPOINTS.getCurrentUser
          : API_ENDPOINTS.getUserById(userId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(mapUserToProfile(res.data));
    } catch (err) {
      console.error("Unable to load user info", err);
    }
  }, [isSelf, userId]);

  const fetchHolidays = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_ENDPOINTS.getHolidays, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch holidays", error);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        isSelf
          ? API_ENDPOINTS.getMyAttendance
          : API_ENDPOINTS.getAttendanceByUser(userId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data || [];
      setAttendanceHistory(data);

      // Determine check-in/check-out type for self
      if (isSelf) {
        const today = new Date().toDateString();
        const todayEntries = data.filter(
          (entry) => new Date(entry.timestamp).toDateString() === today
        );

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
      console.error("Unable to load attendance data", err);
    }
  }, [isSelf, userId]);

  useEffect(() => {
    fetchUser();
    fetchAttendance();
    fetchHolidays();
  }, [fetchUser, fetchAttendance, fetchHolidays]);

  // Attendance helper functions
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
      () =>
        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: "We couldn't access your location. You can continue without sharing it.",
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
          if (useLocation) {
            getLocation();
          }
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

    if (useLocation && !location) {
      Swal.fire(
        "Location Unavailable",
        "We couldn't get your location. You can try again or turn off location sharing.",
        "warning"
      );
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    if (useLocation && location) {
      formData.append("location", location);
    }
    formData.append("workMode", workMode);
    formData.append("isInOffice", workMode === "office" || workMode === "hybrid");
    
    if (compressedBlob) {
      formData.append("image", compressedBlob);
    }

    try {
      setIsSubmitting(true);
      await axios.post(API_ENDPOINTS.postAttendance, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire(
        "Success",
        `${type === "check-in" ? "Checked In" : "Checked Out"} successfully as ${workMode.charAt(0).toUpperCase() + workMode.slice(1)}`,
        "success"
      );
      setImage(null);
      setCompressedBlob(null);
      setLocation("");
      setSkipCamera(false);
      setWorkMode("office");
      stopCamera();
      setIsCapturing(false);
      setUseLocation(false);
      fetchAttendance();
    } catch (err) {
      Swal.fire("Failed", "Could not submit attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSave = async (updatedProfile, avatarFile) => {
    if (!updatedProfile?.id) {
      setShowProfileEditor(false);
      return;
    }

    if (updatedProfile.newPassword || updatedProfile.confirmPassword || updatedProfile.currentPassword) {
      if (!updatedProfile.currentPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Required",
          text: "Please enter your current password",
        });
        return;
      }
      if (!updatedProfile.newPassword) {
        Swal.fire({
          icon: "error",
          title: "New Password Required",
          text: "Please enter a new password",
        });
        return;
      }
      if (updatedProfile.newPassword.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must be at least 6 characters long",
        });
        return;
      }
      if (updatedProfile.newPassword !== updatedProfile.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "New password and confirm password do not match",
        });
        return;
      }
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    const fieldMap = {
      name: "name",
      email: "email",
      phone: "phone",
      position: "position",
      department: "department",
      company: "company",
      location: "location",
      employeeId: "employeeId",
      gender: "gender",
      maritalStatus: "maritalStatus",
      dob: "dateOfBirth",
    };

    Object.entries(fieldMap).forEach(([formKey, apiKey]) => {
      let value = updatedProfile[formKey];
      if (value !== undefined && value !== null && value !== "") {
        if (formKey === "employeeId") {
          value = formatEmployeeId(value);
        }
        formData.append(apiKey, value);
      }
    });

    if (updatedProfile.currentPassword) {
      formData.append("currentPassword", updatedProfile.currentPassword);
    }
    if (updatedProfile.newPassword) {
      formData.append("newPassword", updatedProfile.newPassword);
    }

    if (avatarFile) {
      formData.append("profilePic", avatarFile);
    } else if (updatedProfile.avatar !== undefined) {
      formData.append("profilePic", updatedProfile.avatar);
    }

    try {
      setIsSavingProfile(true);
      const { data } = await axios.put(
        API_ENDPOINTS.updateMyProfile,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updated = data?.user ? mapUserToProfile(data.user) : updatedProfile;
      setProfileData(updated);
      Swal.fire({
        icon: "success",
        title: updatedProfile.newPassword ? "Profile and password updated" : "Profile updated",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowProfileEditor(false);
    } catch (err) {
      Swal.fire("Error", "Unable to update profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const currentDayOfMonth = currentTime.getDate();

  const formattedClock = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedWeekday = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [currentTime]);

  const nextHoliday = useMemo(() => {
    if (!holidays.length) return null;
    const today = new Date();
    const upcoming = holidays
      .map((holiday) => ({
        ...holiday,
        dateInstance: new Date(holiday.date),
      }))
      .filter((holiday) => holiday.dateInstance >= today)
      .sort(
        (a, b) => a.dateInstance.getTime() - b.dateInstance.getTime()
      );
    return upcoming[0] || null;
  }, [holidays]);

  const currentMonthAttendance = attendanceHistory.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getFullYear() === currentYear &&
      entryDate.getMonth() === currentMonth
    );
  });

  const attendanceMap = {};
  currentMonthAttendance.forEach((entry) => {
    const dateKey = new Date(entry.timestamp).toDateString();
    if (!attendanceMap[dateKey])
      attendanceMap[dateKey] = { checkin: false, checkout: false };
    if (entry.type === "check-in") attendanceMap[dateKey].checkin = true;
    if (entry.type === "check-out") attendanceMap[dateKey].checkout = true;
  });

  const presentDays = Object.keys(attendanceMap).length;
  const absentDays = Math.max(0, currentDayOfMonth - presentDays);
  const attendanceRate = currentDayOfMonth
    ? Math.round((presentDays / currentDayOfMonth) * 100)
    : 0;

  const calculateWeeklyHours = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let totalWorkedHours = 0;
    for (
      let d = new Date(startOfWeek);
      d <= endOfWeek;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toDateString();
      const dayEntries = attendanceHistory.filter(
        (e) => new Date(e.timestamp).toDateString() === dateKey
      );
      const checkIn = dayEntries.find((e) => e.type === "check-in");
      const checkOut = dayEntries.find((e) => e.type === "check-out");

      if (checkIn && checkOut) {
        const diff = new Date(checkOut.timestamp) - new Date(checkIn.timestamp);
        totalWorkedHours += diff / (1000 * 60 * 60);
      }
    }
    return { totalWorkedHours };
  }, [attendanceHistory]);

  const formatWeeklyHours = () => {
    const { totalWorkedHours } = calculateWeeklyHours();
    const hours = Math.floor(totalWorkedHours);
    const minutes = Math.floor((totalWorkedHours - hours) * 60);
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const heroHighlights = [
    {
      label: "Attendance rate",
      value: `${attendanceRate}%`,
      sub: "This month",
    },
    {
      label: "Days logged",
      value: `${presentDays}/${currentDayOfMonth}`,
      sub: "Month-to-date",
    },
    {
      label: "Weekly hours",
      value: formatWeeklyHours(),
      sub: "Tracked time",
    },
  ];

  const quickInfoCards = [
    {
      title: "Review",
      description: "Hurrah! You've nothing to review.",
      actionLabel: "",
      accent: "teal",
    },
    {
      title: formattedDate,
      description: `${formattedWeekday} • 24 Hours Shift`,
      actionLabel: "Sign in",
      onClick: () => navigate("/timesheet"),
      accent: "indigo",
    },
    {
      title: "Upcoming Holidays",
      description: nextHoliday
        ? `${nextHoliday.name} • ${new Date(
            nextHoliday.date
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        : "No upcoming holidays.",
      actionLabel: "View",
      onClick: () => setShowHolidayModal(true),
      accent: "purple",
    },
    {
      title: "Payslip",
      description: "Access your monthly payslips instantly.",
      actionLabel: "Open",
      onClick: () => navigate("/my-earnings"),
      accent: "orange",
    },
  ];

  const quickActions = [
    {
      label: "My Earnings",
      description: "View payouts & credits",
      accent: "emerald",
      onClick: () => navigate("/my-earnings"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "My Workspace",
      description: "Projects & teammates",
      accent: "indigo",
      onClick: () => navigate("/employee/workspace"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Ask Copilot",
      description: "Design & dev guidance",
      accent: "violet",
      onClick: () => navigate("/employee/ai"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      label: "Task Manager",
      description: "Log daily work",
      accent: "teal",
      onClick: () => navigate("/timesheet"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "Apply Leave",
      description: "Request time off",
      accent: "orange",
      onClick: () => navigate("/apply-leave"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: "Calendar View",
      description: "Review attendance",
      accent: "purple",
      onClick: () => navigate("/calendar"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Holiday List",
      description: "Company calendar",
      accent: "blue",
      onClick: () => setShowHolidayModal(true),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
    },
  ];

  const avatarSrc =
    profileData?.avatar ||
    "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png";

  return (
    <div className="attendance-modern" style={{ padding: '24px', background: 'transparent', minHeight: 'auto' }}>
      <div className="attendance-shell" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
        <div className="modern-layout" style={{ display: 'block', gridTemplateColumns: 'none', gap: 0 }}>
          <main className="modern-main" style={{ marginLeft: 0, width: '100%', padding: 0 }}>
            <section className="modern-hero">
              <div className="modern-hero__left">
                {/* Enhanced Profile Card - Matching Design */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 w-full overflow-hidden">
                  {/* Profile Header Section */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* Profile Picture with Company Logo Overlay */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={avatarSrc}
                          alt={profileData?.name || "Employee"}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-gray-200"
                        />
                        <img
                          src={getCompanyLogo(profileData?.company)}
                          alt={`${profileData?.company || "Company"} logo`}
                          className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white ring-2 p-0.5 object-contain ring-white shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      
                      {/* Employee Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-blue-500 uppercase tracking-wide mb-1">
                          {greeting.toUpperCase()}, {profileData?.name?.split(' ')[0]?.toUpperCase() || "TEAM MEMBER"}
                        </p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1.5 truncate">
                          {profileData?.name || "Team Member"}
                        </h2>
                        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                          {profileData?.position || "Employee"} • {profileData?.company || "Techackode"}
                        </p>
                        
                        {/* Employee ID Badge */}
                        {profileData?.employeeId && (
                          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-300 rounded-lg px-3 py-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-blue-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            <span className="text-xs sm:text-sm font-semibold text-blue-700">
                              {profileData.employeeId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator Line */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* Employee Details Section */}
                  <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                    {/* Email */}
                    {profileData?.email && (
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <span className="text-sm sm:text-base font-semibold text-gray-700 whitespace-nowrap flex-shrink-0">Email:</span>
                        <span className="text-sm sm:text-base text-gray-600 text-right break-all flex-1">{profileData.email}</span>
                      </div>
                    )}
                    
                    {/* Phone */}
                    {profileData?.phone && (
                      <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <span className="text-sm sm:text-base font-semibold text-gray-700 whitespace-nowrap flex-shrink-0">Phone:</span>
                        <span className="text-sm sm:text-base text-gray-600 text-right whitespace-nowrap">{profileData.phone}</span>
                      </div>
                    )}
                    
                    {/* Responsibilities - Always Show */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-sm sm:text-base font-semibold text-gray-700">Responsibility:</span>
                      {profileData?.rolesAndResponsibility && profileData.rolesAndResponsibility.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {profileData.rolesAndResponsibility.map((responsibility, index) => (
                            <li key={index} className="text-sm sm:text-base text-gray-600">
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm sm:text-base text-gray-400 italic ml-2">No responsibilities listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modern-hero__right">
                <div className="modern-hero__time-card">
                  <span className="time-pill">{formattedWeekday}</span>
                  <p className="modern-hero__date">{formattedDate}</p>
                  <p className="modern-hero__clock">{formattedClock}</p>
                  <span className="modern-hero__live">Live time</span>
                </div>
                <div className="modern-hero__highlights">
                  {heroHighlights.map((item) => (
                    <div className="hero-highlight-card" key={item.label}>
                      <span className="label">{item.label}</span>
                      <strong className="value">{item.value}</strong>
                      <span className="sub">{item.sub}</span>
                    </div>
                  ))}
                </div>
                {isSelf && (
                  <button
                    type="button"
                    className="modern-hero__edit"
                    onClick={() => setShowProfileEditor(true)}
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </section>

            <section className="quick-info-grid">
              {quickInfoCards.map((card) => (
                <div
                  key={card.title}
                  className="quick-info-card"
                  data-accent={card.accent}
                >
                  <div>
                    <p className="title">{card.title}</p>
                    <p className="description">{card.description}</p>
                  </div>
                  {card.actionLabel && (
                    <button
                      type="button"
                      className="quick-info-card__action"
                      onClick={card.onClick}
                    >
                      {card.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </section>

            <section className="action-hub-card">
              <div className="action-hub-grid">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className="action-hub-tile"
                    data-accent={action.accent}
                  >
                    <span className="action-hub-tile__icon">{action.icon}</span>
                    <div>
                      <p className="label">{action.label}</p>
                      <p className="description">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Check-in/Check-out Button */}
      {isSelf && type && !isCapturing && (
        <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full px-4 sm:px-6 flex justify-center">
          <button
            onClick={() => {
              setIsCapturing(true);
              setSkipCamera(true);
              setUseLocation(false);
              setLocation("");
              setWorkMode("office");
            }}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 hover:from-emerald-500 hover:via-cyan-500 hover:to-sky-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ripple elevation-4 text-sm sm:text-base min-w-[180px] sm:min-w-[220px]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {type === "check-in" ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Check In
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7 8.586 5.707 7.293a1 1 0 00-1.414 1.414L6.586 11l-2.293 2.293a1 1 0 101.414 1.414L8 12.414l2.293 2.293a1 1 0 001.414-1.414L9.414 11l2.293-2.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Check Out
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      )}

      {/* Attendance Modal */}
      {isCapturing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="glass w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl space-y-4 sm:space-y-6 text-center elevation-4 border border-white/20 max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Work Mode Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 text-left">
                  Work Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkMode("office")}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      workMode === "office"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Office
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkMode("hybrid")}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      workMode === "hybrid"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Hybrid
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkMode("remote")}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      workMode === "remote"
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Remote
                  </button>
                </div>
              </div>

              {/* Optional Location Sharing */}
              <div className="mb-4 sm:mb-6">
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLocation}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setUseLocation(enabled);
                      if (enabled) {
                        getLocation();
                      } else {
                        setLocation("");
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Share location (optional)
                  </span>
                </label>
              </div>

              {/* Skip Camera Option */}
              <div className="mb-4 sm:mb-6">
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipCamera}
                    onChange={(e) => {
                      setSkipCamera(e.target.checked);
                      if (e.target.checked) {
                        stopCamera();
                      } else {
                        startCamera();
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">Skip camera (optional)</span>
                </label>
              </div>

              {skipCamera ? (
                // Skip Camera - Direct Submit
                <>
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold gradient-text mb-2">
                      {type === "check-in" ? "Check In" : "Check Out"} - {workMode.charAt(0).toUpperCase() + workMode.slice(1)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Camera skipped. Ready to submit.
                    </p>
                  </div>
                  <div className="glass rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600 space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold text-slate-700">Attendance Details</span>
                    </div>
                    <p>
                      <span className="font-medium">Mode:</span> {workMode.charAt(0).toUpperCase() + workMode.slice(1)}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {type === "check-in" ? "Check In" : "Check Out"}
                    </p>
                    {location && (
                      <p>
                        <span className="font-medium">Location:</span> {location}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setIsCapturing(false);
                        setSkipCamera(false);
                        setUseLocation(false);
                        setLocation("");
                        setWorkMode("office");
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAttendance}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple shadow-lg text-sm sm:text-base ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
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
              ) : !image ? (
                // Camera View
                <>
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold gradient-text mb-2">
                      Take Attendance Photo
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Position your face in the center
                    </p>
                  </div>
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-inner mb-4 sm:mb-6">
                    <CameraView ref={videoRef} />
                    <div className="absolute inset-0 border-2 sm:border-4 border-white/30 rounded-xl sm:rounded-2xl pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 border-2 border-blue-500 rounded-full pointer-events-none animate-pulse"></div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        stopCamera();
                        setIsCapturing(false);
                        setSkipCamera(false);
                        setUseLocation(false);
                        setLocation("");
                        setWorkMode("office");
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple shadow-lg text-sm sm:text-base"
                    >
                      📸 Capture
                    </button>
                  </div>
                </>
              ) : (
                // Image Preview
                <>
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold gradient-text mb-2">
                      Confirm Photo
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Review your attendance photo
                    </p>
                  </div>
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg mb-4 sm:mb-6">
                    <img
                      src={image}
                      alt="Captured"
                      className="rounded-xl sm:rounded-2xl w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                  {capturedTime && (
                    <div className="glass rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600 space-y-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold text-slate-700">
                          Capture Details
                        </span>
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
                          <span className="font-medium">Location:</span>{" "}
                          {location}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(image);
                        setImage(null);
                        setCompressedBlob(null);
                        startCamera();
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple text-sm sm:text-base"
                    >
                      🔄 Retake
                    </button>
                    <button
                      onClick={submitAttendance}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ripple shadow-lg text-sm sm:text-base ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
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

      {/* Holiday Modal */}
      <HolidayModal
        isOpen={showHolidayModal}
        onClose={() => setShowHolidayModal(false)}
      />

      <ProfileCard
        isOpen={showProfileEditor}
        profile={profileData}
        onClose={() => setShowProfileEditor(false)}
        onSave={handleProfileSave}
        isSaving={isSavingProfile}
      />
    </div>
  );
}

export default HomePage;

