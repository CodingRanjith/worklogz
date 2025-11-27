import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/api";
import "./ApplicationsHub.css";

const categories = [
  {
    title: "Chat & Collaboration",
    description: "Stay connected with your team across channels.",
    icon: "💬",
    links: [
      { label: "WhatsApp", url: "https://web.whatsapp.com", icon: "🟢" },
      { label: "Telegram", url: "https://web.telegram.org", icon: "📨" },
      { label: "Google Chat", url: "https://chat.google.com", icon: "🟥" },
      { label: "Microsoft Teams", url: "https://teams.microsoft.com", icon: "🟦" },
    ],
  },
  {
    title: "Meetings",
    description: "Jump into calls or schedule sessions instantly.",
    icon: "📅",
    links: [
      { label: "Google Meet", url: "https://meet.google.com", icon: "🟩" },
      { label: "Zoom", url: "https://zoom.us", icon: "🔵" },
      { label: "Teams Meeting", url: "https://teams.microsoft.com", icon: "🟦" },
    ],
  },
  {
    title: "Work Management",
    description: "Plan, track, and ship projects effortlessly.",
    icon: "🗂️",
    links: [
      { label: "Jira", url: "https://www.atlassian.com/software/jira", icon: "📘" },
      { label: "Trello", url: "https://trello.com", icon: "🟢" },
      { label: "Asana", url: "https://asana.com", icon: "🟣" },
    ],
  },
  {
    title: "Dev & Design",
    description: "Build, review, and design together.",
    icon: "🧩",
    links: [
      { label: "GitHub", url: "https://github.com", icon: "🐙" },
      { label: "GitLab", url: "https://gitlab.com", icon: "🦊" },
      { label: "Canva", url: "https://www.canva.com", icon: "🎨" },
      { label: "Figma", url: "https://www.figma.com", icon: "🎯" },
    ],
  },
  {
    title: "Storage & Assets",
    description: "All your files and artefacts in one place.",
    icon: "🗄️",
    links: [
      { label: "Google Drive", url: "https://drive.google.com", icon: "🟨" },
      { label: "OneDrive", url: "https://onedrive.live.com", icon: "🟦" },
      { label: "Dropbox", url: "https://www.dropbox.com", icon: "💠" },
    ],
  },
];

const ApplicationsHub = ({ onBack }) => {
  const [userApps, setUserApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    icon: "🔗",
  });

  const token = localStorage.getItem("token");

  const fetchUserApps = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.getApplications, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserApps(data || []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    try {
      setSaving(true);
      await axios.post(API_ENDPOINTS.createApplication, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", url: "", category: "", icon: "🔗" });
      setShowForm(false);
      fetchUserApps();
    } catch (error) {
      console.error("Failed to create application", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="apps-hub">
      <header className="apps-hub__header">
        <div>
          <p className="apps-hub__eyebrow">Workspace Hub</p>
          <h2>Applications & Quick Launch</h2>
          <p className="apps-hub__subtitle">
            Jump into your favourite tools, start a conversation, or request a new integration.
          </p>
        </div>
        <div className="apps-hub__cta">
          {onBack && (
            <button type="button" className="apps-hub__btn ghost" onClick={onBack}>
              ← Back to dashboard
            </button>
          )}
          <button
            type="button"
            className="apps-hub__btn primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close form" : "+ Add application"}
          </button>
        </div>
      </header>

      {showForm && (
        <form className="apps-hub__form" onSubmit={handleSubmit}>
          <div>
            <label>Application name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label>Application URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>
          <div className="apps-hub__form-row">
            <div>
              <label>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Support"
              />
            </div>
            <div>
              <label>Icon (emoji)</label>
              <input
                type="text"
                maxLength={4}
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className="apps-hub__btn primary" disabled={saving}>
            {saving ? "Saving…" : "Save application"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="apps-hub__card">Loading your applications…</div>
      ) : (
        userApps.length > 0 && (
          <article className="apps-hub__card">
            <div className="apps-hub__card-head">
              <span className="apps-hub__card-icon" aria-hidden>
                ⭐
              </span>
              <div>
                <h3>Your Favorites</h3>
                <p>Quick links you’ve added for your workflow.</p>
              </div>
            </div>
            <div className="apps-hub__links">
              {userApps.map((app) => (
                <a
                  key={app._id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apps-hub__link"
                >
                  <span className="apps-hub__link-icon" aria-hidden>
                    {app.icon || "🔗"}
                  </span>
                  <span>{app.name}</span>
                  <small className="apps-hub__link-category">
                    {app.category || "Custom"}
                  </small>
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3ZM5 5h5v2H7v12h12v-3h2v5H5V5Z"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </article>
        )
      )}

      <div className="apps-hub__grid">
        {categories.map((category) => (
          <article key={category.title} className="apps-hub__card">
            <div className="apps-hub__card-head">
              <span className="apps-hub__card-icon" aria-hidden>
                {category.icon}
              </span>
              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            </div>
            <div className="apps-hub__links">
              {category.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apps-hub__link"
                >
                  <span className="apps-hub__link-icon" aria-hidden>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3ZM5 5h5v2H7v12h12v-3h2v5H5V5Z"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ApplicationsHub;

