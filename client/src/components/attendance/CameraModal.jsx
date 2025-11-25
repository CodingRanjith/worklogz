// src/components/CameraModal.jsx
import React from "react";

function CameraModal({
  videoRef,
  image,
  capturedTime,
  location,
  onCancel,
  onCapture,
  onRetake,
  onSubmit,
  type,
}) {
  const isCheckIn = type === "check-in";

  return (
    <div className="ms-modal-overlay">
      <div className="ms-modal-panel">
        {!image ? (
          <>
            <div className="ms-camera-frame">
              <video ref={videoRef} autoPlay />
            </div>
            <div className="ms-modal-actions">
              <button className="ms-btn secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="ms-btn primary" onClick={onCapture}>
                Capture
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ms-photo-preview">
              <img src={image} alt="Captured" />
            </div>
            {capturedTime && (
              <div className="ms-photo-meta">
                <p>
                  <span>Captured:</span>{" "}
                  {capturedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" • "}
                  {capturedTime.toLocaleDateString()}
                </p>
                {location && (
                  <p>
                    <span>Location:</span> {location}
                  </p>
                )}
              </div>
            )}
            <div className="ms-modal-actions">
              <button className="ms-btn secondary" onClick={onRetake}>
                Retake
              </button>
              <button className="ms-btn primary" onClick={onSubmit}>
                Submit {isCheckIn ? "Check In" : "Check Out"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraModal;
