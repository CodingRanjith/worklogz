import React from "react";
import "./PeopleDirectory.css";

const formatEmployeeId = (value) => {
  if (!value) return "—";
  const clean = value.toString().replace(/^thc\s*:?/i, "").trim();
  return clean ? `THC${clean.padStart(3, "0")}` : "—";
};

const PeopleDirectory = ({
  users = [],
  loading,
  search,
  setSearch,
  onRefresh,
  onSelect,
  selected,
  onBack,
}) => {
  const filtered = users.filter((user) => {
    if (!search) return true;
    const value = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(value) ||
      user.employeeId?.toLowerCase().includes(value)
    );
  });

  return (
    <section className="people-directory">
      <header className="people-directory__header">
        <div>
          <p className="people-directory__eyebrow">People & Teams</p>
          <h2>All teammates</h2>
          <p>
            Browse every employee, search by name or employee ID, and open a card
            to view profile details.
          </p>
        </div>
        <div className="people-directory__actions">
          <button type="button" className="btn ghost" onClick={onBack}>
            ← Back to dashboard
          </button>
          <button type="button" className="btn primary" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </header>

      <div className="people-directory__search">
        <input
          type="text"
          placeholder="Search by name or employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>{filtered.length} results</span>
      </div>

      <div className="people-directory__layout">
        <div className="people-directory__list">
          {loading ? (
            <div className="people-directory__placeholder">Loading teammates…</div>
          ) : filtered.length === 0 ? (
            <div className="people-directory__placeholder">
              No teammates match “{search}”.
            </div>
          ) : (
            filtered.map((user) => (
              <button
                type="button"
                key={user._id}
                className={`people-card ${
                  selected?._id === user._id ? "is-active" : ""
                }`}
                onClick={() => onSelect(user)}
              >
                <div className="people-card__avatar">
                  <img
                    src={
                      user.profilePic ||
                      "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                    }
                    alt={user.name}
                  />
                </div>
                <div>
                  <p className="people-card__name">{user.name}</p>
                  <p className="people-card__meta">
                    {user.position || "—"} • {user.department || "—"}
                  </p>
                  <p className="people-card__id">{formatEmployeeId(user.employeeId)}</p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="people-directory__detail">
          {!selected ? (
            <div className="people-directory__placeholder">
              Select a teammate to view profile info.
            </div>
          ) : (
            <div className="people-detail">
              <header>
                <img
                  src={
                    selected.profilePic ||
                    "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                  }
                  alt={selected.name}
                />
                <div>
                  <h3>{selected.name}</h3>
                  <p>{selected.position || "—"}</p>
                  <span>{formatEmployeeId(selected.employeeId)}</span>
                </div>
              </header>

              <section>
                <h4>Contact</h4>
                <p>
                  <strong>Email:</strong> {selected.email || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {selected.phone || "—"}
                </p>
              </section>

              <section>
                <h4>Company</h4>
                <p>
                  <strong>Company:</strong> {selected.company || "—"}
                </p>
                <p>
                  <strong>Department:</strong> {selected.department || "—"}
                </p>
                <p>
                  <strong>Date of Joining:</strong>{" "}
                  {selected.dateOfJoining
                    ? new Date(selected.dateOfJoining).toLocaleDateString()
                    : "—"}
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PeopleDirectory;

