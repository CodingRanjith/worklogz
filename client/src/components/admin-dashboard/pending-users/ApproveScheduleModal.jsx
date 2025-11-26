import React, { useEffect, useMemo, useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultDay = { start: '09:00', end: '18:00', isLeave: false };

const buildDefaultSchedule = () =>
  DAYS.reduce((acc, day) => {
    acc[day] = { ...defaultDay };
    return acc;
  }, {});

const ApproveScheduleModal = ({ user, initialSchedule, submitting = false, onClose, onSubmit }) => {
  const baseSchedule = useMemo(() => initialSchedule || buildDefaultSchedule(), [initialSchedule]);
  const [schedule, setSchedule] = useState(buildDefaultSchedule());

  useEffect(() => {
    setSchedule((prev) => {
      const updated = buildDefaultSchedule();
      DAYS.forEach((day) => {
        const entry = baseSchedule?.[day];
        updated[day] = {
          start: entry?.start || prev[day]?.start || defaultDay.start,
          end: entry?.end || prev[day]?.end || defaultDay.end,
          isLeave: Boolean(entry?.isLeave)
        };
      });
      return updated;
    });
  }, [baseSchedule]);

  const updateDay = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleLeave = (day) => {
    setSchedule((prev) => {
      const isLeave = !prev[day].isLeave;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          isLeave,
          start: isLeave ? '' : (prev[day].start || defaultDay.start),
          end: isLeave ? '' : (prev[day].end || defaultDay.end)
        }
      };
    });
  };

  const applyToAll = (sourceDay) => {
    setSchedule((prev) => {
      const reference = prev[sourceDay];
      const next = { ...prev };
      DAYS.forEach((day) => {
        next[day] = { ...reference };
      });
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(schedule);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Assign Schedule</h3>
            <p className="text-sm text-gray-500">
              Set the weekly schedule for <span className="font-semibold text-gray-700">{user?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            disabled={submitting}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
          <div className="px-6 py-4 space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className="text-lg font-semibold text-gray-700">{day}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      id={`${day}-leave`}
                      checked={schedule[day].isLeave}
                      onChange={() => toggleLeave(day)}
                      className="h-4 w-4"
                      disabled={submitting}
                    />
                    <label htmlFor={`${day}-leave`} className="text-gray-600 cursor-pointer select-none">
                      Mark as leave
                    </label>
                  </div>
                </div>

                {!schedule[day].isLeave && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wide text-gray-500">Start</label>
                      <input
                        type="time"
                        value={schedule[day].start}
                        onChange={(e) => updateDay(day, 'start', e.target.value)}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-gray-500">End</label>
                      <input
                        type="time"
                        value={schedule[day].end}
                        onChange={(e) => updateDay(day, 'end', e.target.value)}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => applyToAll(day)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                  disabled={submitting}
                >
                  Apply this schedule to all days
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-white"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Assigning…' : 'Approve & Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveScheduleModal;

