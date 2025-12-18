import React, { useMemo, useState } from "react";
import { API_ENDPOINTS } from "../../utils/api";

/**
 * AttendanceProofRow
 * ------------------
 * Shows today's latest check-in and check-out photos with timestamps.
 */
const AttendanceProofRow = ({ attendanceHistory = [] }) => {
  const [activeImage, setActiveImage] = useState(null);

  const { latestCheckIn, latestCheckOut, checkInUrl, checkOutUrl } = useMemo(
    () => {
      const todayKey = new Date().toDateString();
      const todays = (Array.isArray(attendanceHistory)
        ? attendanceHistory
        : []
      )
        .filter(
          (entry) => new Date(entry.timestamp).toDateString() === todayKey
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const latestIn = [...todays]
        .reverse()
        .find((e) => e.type === "check-in");
      const latestOut = [...todays]
        .reverse()
        .find((e) => e.type === "check-out");

      const buildUrl = (entry) => {
        if (!entry || !entry.image) return "";
        const p = entry.image;
        return p.startsWith("http")
          ? p
          : `${API_ENDPOINTS.uploadPath}/${p.split(/[\\/]/).pop()}`;
      };

      return {
        latestCheckIn: latestIn || null,
        latestCheckOut: latestOut || null,
        checkInUrl: buildUrl(latestIn),
        checkOutUrl: buildUrl(latestOut),
      };
    },
    [attendanceHistory]
  );

  const formatTime = (ts) =>
    ts
      ? new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <>
      <section className="modern-card mt-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-md transition-all duration-200 px-3 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Today&apos;s attendance photos
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Review the latest check-in and check-out photos captured today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-stretch">
            {/* Check-in photo (left) */}
            <div className="ms-stat-card">
              <p className="label">Check-in photo</p>
              {checkInUrl ? (
                <button
                  type="button"
                  onClick={() => setActiveImage(checkInUrl)}
                  className="mt-2 w-full rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-indigo-400 focus:outline-none"
                >
                  <img
                    src={checkInUrl}
                    alt="Check-in"
                    className="w-full h-32 object-cover"
                  />
                </button>
              ) : (
                <p className="note mt-2 text-xs">
                  No check-in photo has been captured today.
                </p>
              )}
              <div className="mt-2 text-[11px] text-slate-600">
                <span className="font-semibold">Check-in:</span>{" "}
                {formatTime(latestCheckIn?.timestamp) || "Not recorded"}
              </div>
            </div>

            {/* Check-out photo (right) */}
            <div className="ms-stat-card">
              <p className="label">Check-out photo</p>
              {checkOutUrl ? (
                <button
                  type="button"
                  onClick={() => setActiveImage(checkOutUrl)}
                  className="mt-2 w-full rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-indigo-400 focus:outline-none"
                >
                  <img
                    src={checkOutUrl}
                    alt="Check-out"
                    className="w-full h-32 object-cover"
                  />
                </button>
              ) : (
                <p className="note mt-2 text-xs">
                  No check-out photo has been captured today.
                </p>
              )}
              <div className="mt-2 text-[11px] text-slate-600 text-right">
                <span className="font-semibold">Check-out:</span>{" "}
                {formatTime(latestCheckOut?.timestamp) || "Not recorded"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen image modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-slate-800">
                Attendance photo
              </h3>
              <button
                onClick={() => setActiveImage(null)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <img
              src={activeImage}
              alt="Attendance detail"
              className="w-full max-h-[70vh] object-cover bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceProofRow;


