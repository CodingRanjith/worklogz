import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../utils/api";

const leaveTypes = [
  { label: "Casual leave", value: "Casual Leave" },
  { label: "Sick leave", value: "Sick Leave" },
  { label: "Privileged leave", value: "Privileged Leave" },
  { label: "Compensation off", value: "Compensation Off" },
  { label: "Emergency leave", value: "Emergency" },
];

const ApplyLeaveForm = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState(leaveTypes[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fromDate) > new Date(toDate)) {
      Swal.fire(
        "Check dates",
        "Start date cannot be later than end date.",
        "warning"
      );
      return;
    }

    const token = localStorage.getItem("token");
    try {
      setIsSubmitting(true);
      await axios.post(
        API_ENDPOINTS.applyLeave,
        { fromDate, toDate, reason, leaveType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Leave requested",
        text: "We’ve submitted your request to HR.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/attendance");
    } catch (error) {
      Swal.fire("Error", "Failed to apply for leave", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="apply-leave-shell">
      <div className="apply-leave-card glass">
        <header>
          <p className="eyebrow">Leave management</p>
          <h1>Request time off</h1>
          <p className="subtitle">
            Submit your leave for approval. HR will get back to you shortly.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="apply-leave-form">
          <div className="field-grid">
            <label>
              <span>Start date</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </label>
            <label>
              <span>End date</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            <span>Leave type</span>
            <div className="segmented-control">
              {leaveTypes.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={
                    option.value === leaveType ? "segment active" : "segment"
                  }
                  onClick={() => setLeaveType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label>
            <span>Reason</span>
            <textarea
              rows={4}
              placeholder="Give HR some context for your leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/attendance")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Submit request"}
            </button>
          </div>
        </form>

        <footer>
          <p>
            Need adjustments?{" "}
            <button
              type="button"
              className="inline-link"
              onClick={() =>
                Swal.fire(
                  "Contact HR",
                  "Email hr@worklogz.com for changes or urgent needs.",
                  "info"
                )
              }
            >
              Contact HR
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ApplyLeaveForm;
