import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AttendancePage.css";
import "./AttendanceModern.css";
import "../../styles/m365Theme.css";
import { useNavigate, useParams } from "react-router-dom";

import { API_ENDPOINTS } from "../../utils/api";
import DateStrip from "../../components/attendance/DateStrip";
import AttendanceCards from "../../components/attendance/AttendanceCards";
import ActivityLog from "../../components/attendance/ActivityLog";
import AttendanceProofRow from "../../components/attendance/AttendanceProofRow";
import CameraView from "../../components/attendance/CameraView";
import { compressImage } from "../../components/attendance/utils";
import HolidayModal from "../../components/holidays/HolidayModal";
import ProfileCard from "./ProfileCard";
import ApplicationsHub from "../../components/attendance/ApplicationsHub";
import PeopleDirectory from "../../components/attendance/PeopleDirectory";
import CommunityHub from "../../components/attendance/CommunityHub";
import MyWorkspace from "../../components/attendance/MyWorkspace";
import TimesheetFullPage from "./Timesheet";
import LeaveManagement from "./LeaveManagement";
import MyEarnings from "./MyEarnings";
import TeamManagement from "./TeamManagement";
import HelpdeskCenter from "../../components/helpdesk/HelpdeskCenter";
import TechAIChat from "../../components/assistant/TechAIChat";
import {
  FiBriefcase,
  FiStar,
} from "react-icons/fi";
import techLogo from "../../assets/tech.png";
import jobzenterLogo from "../../assets/tech.png";

function AttendancePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isSelf = !userId;

  const [type, setType] = useState(null);
  const [image, setImage] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [capturedTime, setCapturedTime] = useState(null);
  const [location, setLocation] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [workMode, setWorkMode] = useState("office"); // office, remote, hybrid
  const [skipCamera, setSkipCamera] = useState(true); // start with camera OFF by default
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, +1 = next week
  const [activeHeroTab, setActiveHeroTab] = useState("How it works");
  const [profileData, setProfileData] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [showApplicationsOnly, setShowApplicationsOnly] = useState(false);
  const [showPeopleOnly, setShowPeopleOnly] = useState(false);
  const [showCommunityOnly, setShowCommunityOnly] = useState(false);
  const [showTaskManagerOnly, setShowTaskManagerOnly] = useState(false);
  const [showLeaveManagementOnly, setShowLeaveManagementOnly] = useState(false);
  const [showEarningsOnly, setShowEarningsOnly] = useState(false);
  const [showWorkspaceOnly, setShowWorkspaceOnly] = useState(false);
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showHelpdeskOnly, setShowHelpdeskOnly] = useState(false);
  const [showAssistantOnly, setShowAssistantOnly] = useState(false);
  const [showTeamManagementOnly, setShowTeamManagementOnly] = useState(false);
  const [useLocation, setUseLocation] = useState(false); // location sharing is optional

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto checkout at 11 PM everyday
  useEffect(() => {
    if (!isSelf) return;
    
    const checkAutoCheckout = async () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      // Check if it's exactly 11:00 PM (23:00)
      if (hour === 23 && minute === 0) {
        const today = new Date().toDateString();
        const todayEntries = attendanceHistory.filter(
          (entry) => new Date(entry.timestamp).toDateString() === today
        );
        
        // Check if user has checked in today but not checked out
        const hasCheckIn = todayEntries.some((entry) => entry.type === "check-in");
        const hasCheckOut = todayEntries.some((entry) => entry.type === "check-out");
        
        if (hasCheckIn && !hasCheckOut) {
          try {
            // Get location
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const autoLocation = `${pos.coords.latitude},${pos.coords.longitude}`;
                const formData = new FormData();
                formData.append("type", "check-out");
                formData.append("location", autoLocation);
                formData.append("workMode", "remote");
                formData.append("isInOffice", false);

                await axios.post(API_ENDPOINTS.postAttendance, formData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                });

                Swal.fire({
                  icon: "info",
                  title: "Auto Checkout",
                  text: "You have been automatically checked out at 11 PM",
                  timer: 3000,
                  showConfirmButton: false,
                });
                
                fetchAttendance();
              },
              async () => {
                // Location failed, still do auto checkout
                const formData = new FormData();
                formData.append("type", "check-out");
                formData.append("location", "Auto-checkout at 11 PM");
                formData.append("workMode", "remote");
                formData.append("isInOffice", false);

                await axios.post(API_ENDPOINTS.postAttendance, formData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                });

                Swal.fire({
                  icon: "info",
                  title: "Auto Checkout",
                  text: "You have been automatically checked out at 11 PM",
                  timer: 3000,
                  showConfirmButton: false,
                });
                
                // Refresh attendance after auto checkout
                setTimeout(() => {
                  fetchAttendance();
                }, 1000);
              },
              async () => {
                // Location failed, still do auto checkout
                const formData = new FormData();
                formData.append("type", "check-out");
                formData.append("location", "Auto-checkout at 11 PM");
                formData.append("workMode", "remote");
                formData.append("isInOffice", false);

                await axios.post(API_ENDPOINTS.postAttendance, formData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                });

                Swal.fire({
                  icon: "info",
                  title: "Auto Checkout",
                  text: "You have been automatically checked out at 11 PM",
                  timer: 3000,
                  showConfirmButton: false,
                });
                
                // Refresh attendance after auto checkout
                setTimeout(() => {
                  fetchAttendance();
                }, 1000);
              }
            );
          } catch (err) {
            console.error("Auto checkout failed:", err);
          }
        }
      }
    };

    const interval = setInterval(checkAutoCheckout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [attendanceHistory, isSelf]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peopleLoadedRef = useRef(false);

  // Dynamic week calculation functions
  const getCurrentWeekDates = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + currentWeekOffset * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { startOfWeek, endOfWeek };
  }, [currentWeekOffset]);

  const calculateWeeklyHours = useCallback(() => {
    const { startOfWeek, endOfWeek } = getCurrentWeekDates();

    let totalWorkedHours = 0;
    let workingDays = 0;

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
        workingDays++;
      }
    }

    return { totalWorkedHours, workingDays };
  }, [attendanceHistory, getCurrentWeekDates]);

  const goToPreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const formatEmployeeId = (value) => {
    if (!value) return "";
    // Remove any existing THC prefix and whitespace
    const clean = value.toString().replace(/^thc\s*:?\s*/i, "").trim();
    // Extract digits only
    const digits = clean.replace(/\D/g, '');
    // If we have digits, format as THC001 format
    if (digits) {
      const padded = digits.padStart(3, '0');
      return `THC${padded}`;
    }
    // If no digits but has value, return as is
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
      // Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to load user info' });
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
  const handleProfileSave = async (updatedProfile, avatarFile) => {
    if (!updatedProfile?.id) {
      setShowProfileEditor(false);
      return;
    }

    // Validate password if password fields are filled
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

    // Add password fields if provided
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

  const fetchPeople = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setPeopleLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPeople(data || []);
      if (!selectedPerson && data?.length) {
        setSelectedPerson(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch teammates", error);
    } finally {
      setPeopleLoading(false);
      peopleLoadedRef.current = true;
    }
  }, [selectedPerson]);

  const fetchCommunityGroups = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(API_ENDPOINTS.getCommunityGroups, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommunityGroups(data || []);
      if (!activeGroupId && data?.length) {
        setActiveGroupId(data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch community groups", error);
    }
  }, [activeGroupId]);

  useEffect(() => {
    fetchUser();
    fetchAttendance();
    fetchHolidays();
  }, [fetchUser, fetchAttendance, fetchHolidays]);

  useEffect(() => {
    if ((showPeopleOnly || showCommunityOnly) && !peopleLoadedRef.current) {
      fetchPeople();
    }
  }, [showPeopleOnly, showCommunityOnly, fetchPeople]);

  useEffect(() => {
    if (showCommunityOnly && communityGroups.length === 0) {
      fetchCommunityGroups();
    }
  }, [showCommunityOnly, communityGroups.length, fetchCommunityGroups]);

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

    // If user opted in to location but we couldn't fetch it yet
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
    
    // Image is optional
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
  const currentMonthYear = currentTime.toLocaleDateString("en-US", {
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

  // Filter attendance history to current month only
  const currentMonthAttendance = attendanceHistory.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getFullYear() === currentYear &&
      entryDate.getMonth() === currentMonth
    );
  });

  // Build attendance map only for current month
  const attendanceMap = {};
  currentMonthAttendance.forEach((entry) => {
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

  // Calculate present days (only from current month)
  const presentDays = Object.keys(attendanceMap).length;
  // Calculate absent days: days elapsed in current month - present days
  const absentDays = Math.max(0, currentDayOfMonth - presentDays);

  const formatWeeklyHours = () => {
    const { totalWorkedHours } = calculateWeeklyHours();
    const hours = Math.floor(totalWorkedHours);
    const minutes = Math.floor((totalWorkedHours - hours) * 60);
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const attendanceRate = currentDayOfMonth
    ? Math.round((presentDays / currentDayOfMonth) * 100)
    : 0;

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

  const heroTabs = [];

  const resetPanels = () => {
    setShowApplicationsOnly(false);
    setShowPeopleOnly(false);
    setShowCommunityOnly(false);
    setShowTaskManagerOnly(false);
    setShowLeaveManagementOnly(false);
    setShowEarningsOnly(false);
    setShowHelpdeskOnly(false);
    setShowAssistantOnly(false);
    setShowWorkspaceOnly(false);
  };

  // Navigation is now handled by EmployeeLayout sidebar
  // These actions are for embedded views within AttendancePage

  const quickActions = [
    {
      label: "My Earnings",
      description: "View payouts & credits",
      accent: "emerald",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetPanels();
        setShowEarningsOnly(true);
      },
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
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetPanels();
        setShowWorkspaceOnly(true);
      },
      icon: <FiBriefcase className="w-4 h-4" />,
    },
    {
      label: "Ask Copilot",
      description: "Design & dev guidance",
      accent: "violet",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetPanels();
        setShowAssistantOnly(true);
      },
      icon: <FiStar className="w-4 h-4" />,
    },
    {
      label: "Task Manager",
      description: "Log daily work",
      accent: "teal",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetPanels();
        setShowTaskManagerOnly(true);
      },
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
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetPanels();
        setShowTaskManagerOnly(true);
      },
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

  const avatarSrc =
    profileData?.avatar ||
    "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png";
  const heroQuote = "";
  const heroQuoteAuthor = "";

  return (
    <div className="attendance-modern" style={{ padding: '24px', background: 'transparent', minHeight: 'auto' }}>
      <div className="attendance-shell" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
        <div className="modern-layout" style={{ display: 'block', gridTemplateColumns: 'none', gap: 0 }}>
          <main className="modern-main" style={{ marginLeft: 0, width: '100%', padding: 0 }}>
            {showEarningsOnly ? (
              <MyEarnings
                embedded
                onBack={() => setShowEarningsOnly(false)}
              />
            ) : showTaskManagerOnly ? (
              <TimesheetFullPage
                embedded
                onBack={() => setShowTaskManagerOnly(false)}
              />
            ) : showLeaveManagementOnly ? (
              <LeaveManagement
                embedded
                onBack={() => setShowLeaveManagementOnly(false)}
              />
            ) : showHelpdeskOnly ? (
              <HelpdeskCenter
                variant="inline"
                onBack={() => setShowHelpdeskOnly(false)}
              />
            ) : showAssistantOnly ? (
              <TechAIChat
                variant="inline"
                onBack={() => setShowAssistantOnly(false)}
              />
            ) : showWorkspaceOnly ? (
              <MyWorkspace onBack={() => setShowWorkspaceOnly(false)} />
            ) : showApplicationsOnly ? (
              <ApplicationsHub onBack={() => setShowApplicationsOnly(false)} />
            ) : showPeopleOnly ? (
              <PeopleDirectory
                users={people}
                loading={peopleLoading}
                search={peopleSearch}
                setSearch={setPeopleSearch}
                onRefresh={fetchPeople}
                selected={selectedPerson}
                onSelect={setSelectedPerson}
                onBack={() => setShowPeopleOnly(false)}
              />
            ) : showTeamManagementOnly ? (
              <TeamManagement
                embedded
                onBack={() => setShowTeamManagementOnly(false)}
              />
            ) : showCommunityOnly ? (
              <CommunityHub
                users={people}
                onBack={() => setShowCommunityOnly(false)}
                groups={communityGroups}
                setGroups={setCommunityGroups}
                activeGroupId={activeGroupId}
                setActiveGroupId={setActiveGroupId}
              />
            ) : (
              <>
            <section className="stats-strip">
              <div className="ms-stat-grid">
                <div className="ms-stat-card emerald">
                  <p className="label">Present days</p>
                  <p className="value">{presentDays}</p>
                  <p className="note">Days attended</p>
                </div>

                <div className="ms-stat-card amber">
                  <p className="label">Absent days</p>
                  <p className="value">{absentDays}</p>
                  <p className="note">Days missed</p>
                </div>

                <div className="ms-stat-card blue">
                  <p className="label">Total days</p>
                  <p className="value">{currentDayOfMonth}</p>
                  <p className="note">{currentMonthYear}</p>
                </div>
              </div>
            </section>

            <section className="daily-panels">
              <div className="daily-panel primary">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-teal-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-teal-100 rounded-lg">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-teal-900">
                        Daily Attendance
                      </h3>
                      <p className="text-xs sm:text-sm text-teal-600">
                        Monitor your daily work activities and time tracking
                      </p>
                    </div>
                  </div>
                  <AttendanceCards attendanceData={attendanceHistory} />

                  <div className="mt-4 sm:mt-6">
                    <ActivityLog activities={filteredLogs} />
                  </div>
                </div>
              </div>
            </section>

            {/* Separate component under Daily Attendance: today check-in/check-out photos */}
            <AttendanceProofRow attendanceHistory={attendanceHistory} />

            <section className="modern-card">
              {/* Light Multi-Color Weekly Analytics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-indigo-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-indigo-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-indigo-900">
                Weekly Performance
              </h3>
              <p className="text-xs sm:text-sm text-indigo-600">
                Track your weekly productivity metrics
              </p>
            </div>
          </div>

          {/* Week Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={goToPreviousWeek}
              className="p-1.5 sm:p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors duration-200"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="text-xs font-medium text-purple-600 mb-0.5 sm:mb-1">
                  Week Period
                </div>
                <div className="text-xs sm:text-sm font-semibold text-purple-800">
                  {(() => {
                    const { startOfWeek, endOfWeek } = getCurrentWeekDates();
                    return `${startOfWeek.toLocaleDateString(
                      "en-GB"
                    )} - ${endOfWeek.toLocaleDateString("en-GB")}`;
                  })()}
                </div>
              </div>
            </div>

            <button
              onClick={goToNextWeek}
              className="p-1.5 sm:p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors duration-200"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {currentWeekOffset !== 0 && (
              <button
                onClick={goToCurrentWeek}
                className="ml-1 sm:ml-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-colors duration-200"
              >
                Current Week
              </button>
            )}
          </div>
        </div>

        {/* Light Multi-Color Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Expected Hours */}
          <div className="bg-cyan-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cyan-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-xs font-medium text-cyan-600 uppercase tracking-wide">
                Expected Hours
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full"></div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-800 mb-2">
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
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                Worked Hours
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">
              {(() => {
                const { totalWorkedHours } = calculateWeeklyHours();
                const hours = Math.floor(totalWorkedHours);
                const minutes = Math.floor((totalWorkedHours - hours) * 60);
                return `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`;
              })()}
            </div>
            <div className="w-full bg-emerald-200 h-1 rounded-full">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (calculateWeeklyHours().totalWorkedHours / 40) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="text-xs text-emerald-600 mt-2">
              Actual Time Logged
            </div>
          </div>

          {/* Efficiency Score */}
          <div className="bg-amber-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                Efficiency
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl sm:text-2xl font-bold text-amber-800">
                {(() => {
                  const { totalWorkedHours, workingDays } =
                    calculateWeeklyHours();
                  const expectedHours = Math.max(workingDays * 8, 40);
                  const efficiency = Math.min(
                    (totalWorkedHours / expectedHours) * 100,
                    100
                  );
                  return Math.round(efficiency);
                })()}
                %
              </div>
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transform -rotate-90"
                  viewBox="0 0 32 32"
                >
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
                      const { totalWorkedHours, workingDays } =
                        calculateWeeklyHours();
                      const expectedHours = Math.max(workingDays * 8, 40);
                      const efficiency = Math.min(
                        (totalWorkedHours / expectedHours) * 100,
                        100
                      );
                      const circumference = 2 * Math.PI * 14;
                      const strokeDasharray =
                        (efficiency / 100) * circumference;
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
                    const { totalWorkedHours, workingDays } =
                      calculateWeeklyHours();
                    const expectedHours = Math.max(workingDays * 8, 40);
                    return Math.min(
                      (totalWorkedHours / expectedHours) * 100,
                      100
                    );
                  })()}%`,
                }}
              ></div>
            </div>
            <div className="text-xs text-amber-600 mt-2">Performance Ratio</div>
          </div>

          {/* Performance Status */}
          <div className="bg-violet-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-violet-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-xs font-medium text-violet-600 uppercase tracking-wide">
                Status
              </div>
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${(() => {
                  const { totalWorkedHours, workingDays } =
                    calculateWeeklyHours();
                  const expectedHours = Math.max(workingDays * 8, 40);
                  const efficiency = (totalWorkedHours / expectedHours) * 100;

                  if (efficiency >= 90) return "bg-violet-600";
                  if (efficiency >= 75) return "bg-violet-500";
                  return "bg-violet-400";
                })()}`}
              ></div>
            </div>
            <div className="text-base sm:text-lg font-semibold text-violet-800 mb-2">
              {(() => {
                const { totalWorkedHours, workingDays } =
                  calculateWeeklyHours();
                const expectedHours = Math.max(workingDays * 8, 40);
                const efficiency = (totalWorkedHours / expectedHours) * 100;

                if (efficiency >= 90) return "Excellent";
                if (efficiency >= 75) return "Good";
                if (efficiency >= 50) return "Average";
                return "Below Target";
              })()}
            </div>
            <div
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(() => {
                const { totalWorkedHours, workingDays } =
                  calculateWeeklyHours();
                const expectedHours = Math.max(workingDays * 8, 40);
                const efficiency = (totalWorkedHours / expectedHours) * 100;

                if (efficiency >= 90) return "bg-violet-100 text-violet-700";
                if (efficiency >= 75) return "bg-violet-100 text-violet-600";
                return "bg-violet-100 text-violet-500";
              })()}`}
            >
              {currentWeekOffset === 0
                ? "This Week"
                : currentWeekOffset < 0
                ? `${Math.abs(currentWeekOffset)} week${
                    Math.abs(currentWeekOffset) > 1 ? "s" : ""
                  } ago`
                : `${currentWeekOffset} week${
                    currentWeekOffset > 1 ? "s" : ""
                  } ahead`}
            </div>
            <div className="text-xs text-violet-600 mt-1">Current Period</div>
          </div>
        </div>
              </div>
            </section>

            {/* Monthly Effort Tracker */}
            <div className="mb-4 sm:mb-6">
              <DateStrip
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                attendanceHistory={attendanceHistory}
              />
            </div>

              </>
            )}
          </main>
        </div>
      </div>
      {isSelf && type && !isCapturing && (
        <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full px-4 sm:px-6 flex justify-center">
          <button
            onClick={() => {
              // Open capture modal without requesting camera or location yet.
              setIsCapturing(true);
              setSkipCamera(true); // camera off by default
              setUseLocation(false); // location off by default
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

export default AttendancePage;
