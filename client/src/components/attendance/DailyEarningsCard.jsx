import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../utils/api";
import axios from "axios";

const DailyEarningsCard = () => {
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTotalEarnings(response.data.data.dailyEarnings || 0);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setTotalEarnings(0);
    } finally {
      setLoading(false);
    }
  };

  const content = loading ? (
    <div className="ms-earnings-loading" />
  ) : (
    <>
      <p className="eyebrow">Admin credited</p>
      <h3>Total Earnings</h3>
      <p className="amount">₹{totalEarnings.toLocaleString("en-IN")}</p>
      <p className="caption">Updated daily after approval</p>
    </>
  );

  return <div className="ms-earnings-card">{content}</div>;
};

export default DailyEarningsCard;