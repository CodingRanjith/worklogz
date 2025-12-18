import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiUsers,
  FiBriefcase,
  FiLayers,
  FiGrid,
  FiBarChart2,
  FiSettings,
  FiTrendingUp,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { API_ENDPOINTS } from '../../utils/api';

const COLORS = ['#4f46e5', '#22c55e', '#f97316', '#06b6d4', '#a855f7', '#ef4444'];

const Company = () => {
  const [employees, setEmployees] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, settingsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.getUsers, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios
            .get(API_ENDPOINTS.getCompanySettings, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: null })), // company settings are optional
        ]);

        setEmployees(Array.isArray(usersRes.data) ? usersRes.data : []);
        setCompanySettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to load company dashboard data', err);
        setError('Failed to load company overview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('You are not authorized. Please login again.');
      setLoading(false);
    }
  }, [token]);

  const uniqueCount = (field) => {
    const set = new Set(
      employees
        .map((e) => e?.[field])
        .filter((v) => v && typeof v === 'string' && v.trim() !== '')
    );
    return set.size;
  };

  const totalEmployees = employees.length;
  const totalRoles = uniqueCount('role');
  const totalDepartments = uniqueCount('department') || uniqueCount('departmentName');
  const totalDivisions = uniqueCount('division');
  const totalCompanies = uniqueCount('company');

  const employeesByDepartment = Object.values(
    employees.reduce((acc, emp) => {
      const dept = emp.department || emp.departmentName || 'Unassigned';
      if (!acc[dept]) acc[dept] = { name: dept, value: 0 };
      acc[dept].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const employeesByRole = Object.values(
    employees.reduce((acc, emp) => {
      const role = emp.role || 'Unassigned';
      if (!acc[role]) acc[role] = { name: role, value: 0 };
      acc[role].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const employeesByCompany = Object.values(
    employees.reduce((acc, emp) => {
      const company = emp.company || 'Unassigned';
      if (!acc[company]) acc[company] = { name: company, value: 0 };
      acc[company].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const currentPlanName =
    companySettings?.planName ||
    companySettings?.subscriptionPlan ||
    companySettings?.currentPlan ||
    'Free / Not Set';

  const planStatus =
    companySettings?.planStatus ||
    companySettings?.subscriptionStatus ||
    companySettings?.status ||
    'Active';

  const planUsersLimit =
    companySettings?.userLimit ||
    companySettings?.maxUsers ||
    companySettings?.seats ||
    null;

  const planExpiry =
    companySettings?.planExpiry ||
    companySettings?.expiryDate ||
    companySettings?.planEndDate ||
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
          <span className="text-sm font-medium">Loading company overview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 text-red-700 rounded-xl border border-red-100">
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Company Overview',
      icon: FiBarChart2,
      description: 'High-level summary of your organization',
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: FiBriefcase,
      badge: totalRoles,
      description: 'Distribution of employees by role',
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: FiLayers,
      badge: totalDepartments,
      description: 'Distribution of employees by department',
    },
    {
      id: 'divisions',
      label: 'Divisions',
      icon: FiGrid,
      badge: totalDivisions,
      description: 'Overview of divisions',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: FiUsers,
      badge: totalCompanies,
      description: 'Multi-company breakdown',
    },
    {
      id: 'plan',
      label: 'Plan & Billing',
      icon: FiSettings,
      description: 'Current Worklogz plan details',
    },
  ];

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Total Employees
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Unique Roles
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalRoles}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
              <FiBriefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Departments
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalDepartments}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-50 text-amber-600">
              <FiLayers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Companies
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalCompanies}</p>
            </div>
            <div className="p-3 rounded-full bg-cyan-50 text-cyan-600">
              <FiGrid className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Employees by Department
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Top departments where your people are distributed
              </p>
            </div>
          </div>
          {employeesByDepartment.length === 0 ? (
            <p className="text-sm text-gray-500">No department data available.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeesByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    height={50}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Roles Split
            </p>
            <FiTrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          {employeesByRole.length === 0 ? (
            <p className="text-sm text-gray-500">No role data available.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employeesByRole.slice(0, 6)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {employeesByRole.slice(0, 6).map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
            {employeesByRole.slice(0, 6).map((role, index) => (
              <div
                key={role.name}
                className="flex items-center justify-between text-xs text-gray-600"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[140px]">{role.name}</span>
                </div>
                <span className="font-medium">{role.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Current Worklogz Plan
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Your subscription details and utilization overview
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              planStatus?.toLowerCase() === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            <FiClock className="w-3 h-3 mr-1" />
            {planStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Plan Name</p>
            <p className="text-sm font-semibold text-gray-900">{currentPlanName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Employees in system</p>
            <p className="text-sm font-semibold text-gray-900">{totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Plan Seats / Limit</p>
            <p className="text-sm font-semibold text-gray-900">
              {planUsersLimit ? `${totalEmployees} / ${planUsersLimit}` : 'Not configured'}
            </p>
          </div>
          {planExpiry && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Plan Expiry</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(planExpiry).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderRoles = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Employees by Role
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Quick view of how people are distributed across roles
          </p>
        </div>
      </div>
      {employeesByRole.length === 0 ? (
        <p className="text-sm text-gray-500">No role data available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeesByRole}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  height={60}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {employeesByRole.map((role, index) => (
              <div
                key={role.name}
                className="flex items-center justify-between text-sm text-gray-700 border-b border-dashed border-gray-100 pb-1 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[200px]">{role.name}</span>
                </div>
                <span className="font-semibold">{role.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDepartments = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Employees by Department
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Understand how departments are staffed across the company
          </p>
        </div>
      </div>
      {employeesByDepartment.length === 0 ? (
        <p className="text-sm text-gray-500">No department data available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeesByDepartment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  height={60}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {employeesByDepartment.map((dept, index) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-sm text-gray-700 border-b border-dashed border-gray-100 pb-1 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[200px]">{dept.name}</span>
                </div>
                <span className="font-semibold">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCompanies = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb  -4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Companies in Worklogz
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Breakdown of employees across linked companies / entities
          </p>
        </div>
      </div>
      {employeesByCompany.length === 0 ? (
        <p className="text-sm text-gray-500">No company data available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeesByCompany}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {employeesByCompany.map((entry, index) => (
                    <Cell
                      key={`cell-company-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {employeesByCompany.map((company, index) => (
              <div
                key={company.name}
                className="flex items-center justify-between text-sm text-gray-700 border-b border-dashed border-gray-100 pb-1 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[200px]">{company.name}</span>
                </div>
                <span className="font-semibold">{company.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPlan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Subscription Overview
            </p>
            <p className="mt-1 text-sm text-gray-600">
              High level details about your Worklogz plan and usage
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              planStatus?.toLowerCase() === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            <FiClock className="w-3 h-3 mr-1" />
            {planStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Plan Name</p>
            <p className="text-sm font-semibold text-gray-900">{currentPlanName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Total Employees</p>
            <p className="text-sm font-semibold text-gray-900">{totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Seat Limit</p>
            <p className="text-sm font-semibold text-gray-900">
              {planUsersLimit ? `${planUsersLimit}` : 'Not configured'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Utilization</p>
            <p className="text-sm font-semibold text-gray-900">
              {planUsersLimit
                ? `${Math.min(
                    100,
                    Math.round((totalEmployees / planUsersLimit) * 100)
                  )}% used`
                : 'N/A'}
            </p>
          </div>
          {planExpiry && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Plan Expiry</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(planExpiry).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
          Master Data Options
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Use the left sidebar to open detailed master screens like Departments, Roles,
          Divisions, Companies and more. This summary page is only for quick analytics.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-dashed border-gray-200 p-3">
            <p className="font-medium text-gray-800 mb-1">Company Master</p>
            <p className="text-gray-500">
              Configure your main company profile, branding, and legal details.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-200 p-3">
            <p className="font-medium text-gray-800 mb-1">HR & People Settings</p>
            <p className="text-gray-500">
              Define roles, departments, and reporting structure for your teams.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-200 p-3">
            <p className="font-medium text-gray-800 mb-1">Billing & Plans</p>
            <p className="text-gray-500">
              Manage subscription, billing cycle and plan upgrades with Worklogz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDivisions = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
        Divisions Overview
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Division-wise structure will appear automatically once employees are mapped with
        a `division` field in their profile.
      </p>
      <p className="text-sm text-gray-500">
        If you are not using divisions yet, you can continue using Departments and
        Companies to organize your team. Master configuration for divisions can be added
        later in the Company / HR settings.
      </p>
    </div>
  );

  let content;
  if (activeTab === 'overview') content = renderOverview();
  else if (activeTab === 'roles') content = renderRoles();
  else if (activeTab === 'departments') content = renderDepartments();
  else if (activeTab === 'companies') content = renderCompanies();
  else if (activeTab === 'plan') content = renderPlan();
  else if (activeTab === 'divisions') content = renderDivisions();

  return (
    <div className="min-h-full flex flex-col">
      <div className="mb-4">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Master · Company
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
          Company Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          High level view of employees, roles, departments, divisions and subscription
          plan for this company in Worklogz.
        </p>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar options */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 sm:p-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`p-1.5 rounded-md ${
                        isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-[11px] text-gray-500 line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.badge != null && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">{content}</main>
      </div>
    </div>
  );
};

export default Company;


