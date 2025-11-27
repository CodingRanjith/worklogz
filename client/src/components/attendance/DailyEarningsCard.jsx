import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrendingUp, FiRefreshCw, FiShield } from "react-icons/fi";
import { API_ENDPOINTS } from "../../utils/api";

const DailyEarningsCard = () => {
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const { dailyEarnings, updatedAt } = data.data || {};
        setTotalEarnings(dailyEarnings || 0);
        setLastUpdated(updatedAt ? new Date(updatedAt) : new Date());
      } else {
        setTotalEarnings(0);
        setLastUpdated(null);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setTotalEarnings(0);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-earnings-card">
      <div className="daily-earnings-card__header">
        <div>
          <p className="eyebrow">Daily salary credits</p>
          <h3>Total Earnings</h3>
        </div>
        <button
          className="refresh-btn"
          onClick={fetchEarnings}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "spin" : ""} />
        </button>
      </div>

      <div className="daily-earnings-card__amount">
        {loading ? (
          <div className="pulse-amount" />
        ) : (
          <>
            <span className="currency">₹</span>
            <span>{totalEarnings.toLocaleString("en-IN")}</span>
          </>
        )}
      </div>

      <div className="daily-earnings-card__meta">
        <div className="meta-pill">
          <FiTrendingUp />
          <span>
            {totalEarnings >= 1000 ? "Consistent growth" : "Keep logging time"}
          </span>
        </div>
        <div className="meta-pill">
          <FiShield />
          <span>Admin verified credits</span>
        </div>
      </div>

      <p className="daily-earnings-card__foot">
        {loading
          ? "Syncing latest payout..."
          : lastUpdated
          ? `Updated ${lastUpdated.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })} at ${lastUpdated.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`
          : "Awaiting first credit"}
      </p>
    </div>
  );
};

export default DailyEarningsCard;