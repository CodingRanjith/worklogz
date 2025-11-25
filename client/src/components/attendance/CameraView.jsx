import React, { forwardRef, useEffect } from "react";

const CameraView = forwardRef((props, ref) => {
  useEffect(() => {
    if (ref?.current) {
      ref.current.play().catch((err) => {
        console.warn("Autoplay error:", err);
      });
    }
  }, [ref]);

  return (
    <div className="ms-camera-shell">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted
        style={{
          transform: "scaleX(-1)",
          WebkitTransform: "scaleX(-1)",
        }}
      />
    </div>
  );
});

export default CameraView;
