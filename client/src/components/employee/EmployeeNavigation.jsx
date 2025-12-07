import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiBriefcase,
  FiUsers,
  FiGrid,
  FiUser,
  FiHelpCircle,
  FiStar,
  FiLogOut, 
  FiMenu, 
  FiX,
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiBook,
  FiEdit3,
  FiPlay
} from 'react-icons/fi';
import { filterMenuByPaths, getAccessForUser } from '../../utils/sidebarAccess';

export const employeeMenuItems = [
  { path: '/attendance', icon: <FiClock />, label: 'Attendance', color: 'blue' },
  { path: '/employee/community', icon: <FiUsers />, label: 'Community', color: 'indigo' },
  { path: '/employee/workspace', icon: <FiBriefcase />, label: 'My Workspace', color: 'purple' },
  { path: '/timesheet', icon: <FiFileText />, label: 'Team Task Manager', color: 'teal' },
  { path: '/my-earnings', icon: <FiDollarSign />, label: 'Salary', color: 'emerald' },
  { path: '/apply-leave', icon: <FiCalendar />, label: 'Leave Management', color: 'orange' },
  { path: '/skill-development', icon: <FiBook />, label: 'Skill Development', color: 'amber' },
  { path: '/employee/assessments', icon: <FiEdit3 />, label: 'Assessments', color: 'purple' },
  { path: '/goals-achievements', icon: <FiTarget />, label: 'Goals & Achievements', color: 'yellow' },
  { path: '/calendar', icon: <FiCalendar />, label: 'Calendar View', color: 'pink' },
  { path: '/performance', icon: <FiTrendingUp />, label: 'Performance', color: 'green' },
  { path: '/employee/applications', icon: <FiGrid />, label: 'Applications', color: 'pink' },
  { path: '/employee/people', icon: <FiUser />, label: 'People', color: 'cyan' },
  { path: '/team-management', icon: <FiUsers />, label: 'Team Management', color: 'yellow' },
  { path: '/documents', icon: <FiFileText />, label: 'Document Center', color: 'gray' },
  { path: '/helpdesk', icon: <FiHelpCircle />, label: 'Helpdesk', color: 'slate' },
  { path: '/employee/ai', icon: <FiStar />, label: 'AI Copilot', color: 'violet' },
  { path: '/employee/worklogztube', icon: <FiPlay />, label: 'WorklogzTube', color: 'red' },
];

const EmployeeNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');

  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.id || decoded._id || null;
    } catch (err) {
      console.warn('Failed to decode token for navigation filtering', err);
      return null;
    }
  }, [token]);

  const [allowedPaths, setAllowedPaths] = useState(null);

  useEffect(() => {
    const loadAllowedPaths = async () => {
      if (!currentUserId) {
        setAllowedPaths(null);
        return;
      }
      try {
        const paths = await getAccessForUser(currentUserId, 'employee');
        setAllowedPaths(paths);
      } catch (err) {
        console.warn('Failed to load allowed paths', err);
        setAllowedPaths(null);
      }
    };
    loadAllowedPaths();
  }, [currentUserId]);

  const visibleMenuItems = useMemo(
    () => filterMenuByPaths(employeeMenuItems, allowedPaths),
    [allowedPaths]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-blue-50',
      indigo: active ? 'bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-indigo-50',
      purple: active ? 'bg-purple-100 text-purple-600 border-l-4 border-purple-600' : 'text-gray-600 hover:bg-purple-50',
      green: active ? 'bg-green-100 text-green-600 border-l-4 border-green-600' : 'text-gray-600 hover:bg-green-50',
      yellow: active ? 'bg-yellow-100 text-yellow-600 border-l-4 border-yellow-600' : 'text-gray-600 hover:bg-yellow-50',
      pink: active ? 'bg-pink-100 text-pink-600 border-l-4 border-pink-600' : 'text-gray-600 hover:bg-pink-50',
      amber: active ? 'bg-amber-100 text-amber-600 border-l-4 border-amber-600' : 'text-gray-600 hover:bg-amber-50',
      teal: active ? 'bg-teal-100 text-teal-600 border-l-4 border-teal-600' : 'text-gray-600 hover:bg-teal-50',
      emerald: active ? 'bg-emerald-100 text-emerald-600 border-l-4 border-emerald-600' : 'text-gray-600 hover:bg-emerald-50',
      orange: active ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-600' : 'text-gray-600 hover:bg-orange-50',
      cyan: active ? 'bg-cyan-100 text-cyan-600 border-l-4 border-cyan-600' : 'text-gray-600 hover:bg-cyan-50',
      gray: active ? 'bg-gray-100 text-gray-600 border-l-4 border-gray-600' : 'text-gray-600 hover:bg-gray-50',
      slate: active ? 'bg-slate-100 text-slate-600 border-l-4 border-slate-600' : 'text-gray-600 hover:bg-slate-50',
      violet: active ? 'bg-violet-100 text-violet-600 border-l-4 border-violet-600' : 'text-gray-600 hover:bg-violet-50',
      red: active ? 'bg-red-100 text-red-600 border-l-4 border-red-600' : 'text-gray-600 hover:bg-red-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white p-3 rounded-lg shadow-lg text-gray-700 hover:bg-gray-100"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-xl w-72`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <FiUser className="text-2xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Employee Portal</h2>
                <p className="text-sm opacity-90">Welcome back!</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${getColorClasses(
                  item.color,
                  isActive(item.path)
                )}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
            >
              <FiLogOut className="text-2xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default EmployeeNavigation;

