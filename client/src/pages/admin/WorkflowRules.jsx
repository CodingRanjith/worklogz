import React, { useState } from 'react';
import {
  FiPlus,
  FiZap,
  FiFilter,
  FiClock,
  FiToggleRight,
  FiSearch,
  FiAlertCircle,
  FiSettings,
} from 'react-icons/fi';

const initialRules = [
  {
    id: 1,
    name: 'Auto-approve WFH for HR',
    description: 'If HR team member applies for WFH for 1 day, auto-approve the request.',
    module: 'Leave & Attendance',
    trigger: 'On Leave Request Created',
    condition: 'Department is HR · Duration 1 day',
    actions: ['Auto-approve request', 'Notify reporting manager'],
    status: 'active',
    lastRun: '2 hours ago',
  },
  {
    id: 2,
    name: 'Notify Finance on new joiners',
    description: 'When a new employee is created, notify finance and payroll teams.',
    module: 'Employees',
    trigger: 'On Employee Created',
    condition: 'Any new employee',
    actions: ['Send email to Finance', 'Create checklist in Tasks'],
    status: 'active',
    lastRun: 'Yesterday',
  },
  {
    id: 3,
    name: 'Flag continuous late comers',
    description: 'If an employee is late more than 3 days in a week, flag to HR.',
    module: 'Attendance',
    trigger: 'On Attendance Summary',
    condition: 'Late days > 3 in last 7 days',
    actions: ['Create alert for HR', 'Notify reporting manager'],
    status: 'inactive',
    lastRun: '3 days ago',
  },
];

const WorkflowRules = () => {
  const [rules] = useState(initialRules);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      !search ||
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : rule.status === statusFilter;

    const matchesModule =
      moduleFilter === 'all' ? true : rule.module === moduleFilter;

    return matchesSearch && matchesStatus && matchesModule;
  });

  const modules = Array.from(new Set(rules.map((r) => r.module)));

  return (
    <div className="min-h-full flex flex-col">
      <div className="mb-4">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Settings · Automation
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
          Workflow Rules
        </h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Define no‑code automation rules to keep your HR, attendance, payroll and
          team workflows running automatically based on smart conditions.
        </p>
      </div>

      {/* Top actions + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Create New Workflow
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Start by choosing a trigger like attendance, leave, or employee changes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-1.5" />
                New Rule
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiZap className="w-4 h-4 mr-1.5 text-amber-500" />
                Explore Templates
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Automation Health
            </p>
            <FiSettings className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {rules.filter((r) => r.status === 'active').length}
                <span className="text-sm font-medium text-gray-400 ml-1">
                  / {rules.length} active
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Smart rules running across HR, attendance and payroll modules.
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1 text-xs">
              <div className="flex items-center space-x-1 text-emerald-600">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Healthy</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <FiClock className="w-3 h-3" />
                <span>Last run: few minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by rule name or description..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4 mr-1.5" />
              Advanced
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Modules</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Defined Rules
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {filteredRules.length} of {rules.length} rules shown based on filters.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
              <span>Inactive</span>
            </div>
          </div>
        </div>

        {filteredRules.length === 0 ? (
          <div className="p-6 flex flex-col items-center text-center text-gray-500 space-y-3">
            <FiAlertCircle className="w-8 h-8 text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">No rules match your filters</p>
              <p className="text-xs text-gray-500 mt-1">
                Try clearing the search text or selecting a different module/status.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="px-4 sm:px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {rule.module}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {rule.trigger}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {rule.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {rule.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100">
                        <FiFilter className="w-3 h-3 mr-1" />
                        {rule.condition}
                      </span>
                      {rule.actions.map((action, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
                        >
                          <FiZap className="w-3 h-3 mr-1" />
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-end justify-between sm:items-end gap-2 flex-shrink-0">
                    <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                      <FiClock className="w-3 h-3" />
                      <span>Last run {rule.lastRun}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          rule.status === 'active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-gray-100 border-gray-200 text-gray-600'
                        }`}
                      >
                        <FiToggleRight className="w-3 h-3 mr-1" />
                        {rule.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowRules;


