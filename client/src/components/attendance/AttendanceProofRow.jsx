import React, { useMemo, useState } from "react";
import { API_ENDPOINTS } from "../../utils/api";

/**
 * AttendanceProofRow
 * ------------------
 * Shows today's proof row with:
 * - Latest attendance photo (click to open modal)
 * - Location name + coordinates
 * - Mini map (click to open fullscreen map modal)
 */
const AttendanceProofRow = ({ attendanceHistory = [] }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const proofData = useMemo(() => {
    if (!attendanceHistory.length) {
      return {
        latestCheckInToday: null,
        latestCheckOutToday: null,
        latestImageUrl: "",
        locationLabel: "No location recorded",
        latitude: null,
        longitude: null,
        hasCoordinates: false,
        mapEmbedUrl: "",
        fullMapUrl: "",
      };
    }

    const todayKey = new Date().toDateString();
    const todayEntries = attendanceHistory
      .filter(
        (entry) => new Date(entry.timestamp).toDateString() === todayKey
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const latestCheckInToday = [...todayEntries]
      .reverse()
      .find((e) => e.type === "check-in");
    const latestCheckOutToday = [...todayEntries]
      .reverse()
      .find((e) => e.type === "check-out");

    const latestWithImage = [...todayEntries]
      .reverse()
      .find((e) => e.image);
    const latestLocationRecord =
      [...todayEntries].reverse()[0] || latestWithImage || null;

    const rawLocation = latestLocationRecord?.location || "";
    const officeName = latestLocationRecord?.officeName || "";

    let latitude = null;
    let longitude = null;
    let locationLabel = officeName || rawLocation || "No location recorded";

    if (rawLocation && rawLocation.includes(",")) {
      const [latStr, lngStr] = rawLocation.split(",");
      const latNum = parseFloat(latStr);
      const lngNum = parseFloat(lngStr);
      if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
        latitude = latNum;
        longitude = lngNum;
        if (officeName) {
          locationLabel = officeName;
        } else {
          locationLabel = "Pinned location";
        }
      }
    }

    const latestImagePath = latestWithImage?.image || "";
    const latestImageUrl = latestImagePath
      ? latestImagePath.startsWith("http")
        ? latestImagePath
        : `${API_ENDPOINTS.uploadPath}/${latestImagePath
            .split(/[\\/]/)
            .pop()}`
      : "";

    const hasCoordinates = latitude != null && longitude != null;
    const mapEmbedUrl = hasCoordinates
      ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=k&z=16&output=embed`
      : "";
    const fullMapUrl = hasCoordinates
      ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=k&z=16`
      : "";

    return {
      latestCheckInToday,
      latestCheckOutToday,
      latestImageUrl,
      locationLabel,
      latitude,
      longitude,
      hasCoordinates,
      mapEmbedUrl,
      fullMapUrl,
    };
  }, [attendanceHistory]);

  const {
    latestCheckInToday,
    latestCheckOutToday,
    latestImageUrl,
    locationLabel,
    latitude,
    longitude,
    hasCoordinates,
    mapEmbedUrl,
    fullMapUrl,
  } = proofData;

  // If there is no attendance at all for today, still show the cards but with empty state

  const formatTime = (ts) =>
    ts
      ? new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <>
      <section className="modern-card mt-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200/70 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Today&apos;s work snapshot
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Review today&apos;s latest attendance photo, work location, and map.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Latest check-in / check-out photo */}
            <div className="ms-stat-card">
              <p className="label">Attendance photo</p>
              {latestImageUrl ? (
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="mt-2 w-full rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-indigo-400 focus:outline-none"
                >
                  <img
                    src={latestImageUrl}
                    alt="Attendance"
                    className="w-full h-40 object-cover"
                  />
                </button>
              ) : (
                <p className="note mt-2">No photo captured for today.</p>
              )}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold">Check-in time:</span>{" "}
                  {formatTime(latestCheckInToday?.timestamp) || "--:--"}
                </p>
                <p>
                  <span className="font-semibold">Check-out time:</span>{" "}
                  {formatTime(latestCheckOutToday?.timestamp) || "Not recorded"}
                </p>
              </div>
            </div>

            {/* Card 2: Location info */}
            <div className="ms-stat-card">
              <p className="label">Location details</p>
              <p className="value text-lg md:text-2xl break-words">
                {locationLabel}
              </p>
              <div className="note mt-2 text-xs space-y-1">
                <p className="font-semibold">Geographical coordinates</p>
                <p>
                  Lat:{" "}
                  {latitude != null ? latitude.toFixed(6) : "Not available"}
                </p>
                <p>
                  Lng:{" "}
                  {longitude != null ? longitude.toFixed(6) : "Not available"}
                </p>
              </div>
            </div>

            {/* Card 3: Mini map with fullscreen option */}
            <div className="ms-stat-card">
              <p className="label">Work location map</p>
              {hasCoordinates ? (
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="mt-2 w-full rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-indigo-400 focus:outline-none"
                  title="Open full map"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      title="Today location map"
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </button>
              ) : (
                <p className="note mt-2">
                  Map preview is not available because no location was recorded.
                </p>
              )}
              {hasCoordinates && (
                <p className="note mt-2 text-xs">
                  Click the map to open a larger, full-screen view.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image modal */}
      {showImageModal && latestImageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-slate-800">
                Today attendance photo
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-slate-500 hover:text-slate-800 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <img
              src={latestImageUrl}
              alt="Attendance full view"
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* Map fullscreen modal */}
      {showMapModal && hasCoordinates && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full h-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-slate-800">
                Today location map
              </h3>
              <div className="flex items-center gap-3">
                {fullMapUrl && (
                  <a
                    href={fullMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Open in Maps
                  </a>
                )}
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-slate-500 hover:text-slate-800 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1">
              <iframe
                title="Today full location map"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceProofRow;


