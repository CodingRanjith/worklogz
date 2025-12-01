import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiLayers,
  FiFlag,
  FiTarget,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../utils/api";
import "./MyWorkspace.css";

const WorkspaceTooling = [
  { label: "Project brief", description: "Capture scope & approvals" },
  { label: "Stand-up notes", description: "Log blockers in 2 mins" },
  { label: "Handover kit", description: "Docs & assets in one link" },
];

const MyWorkspace = ({ onBack }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_ENDPOINTS.getMyProjects, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = data.data || [];
      setProjects(list);
      setSelectedProject(list[0] || null);
    } catch (error) {
      console.error("Failed to load projects", error);
      Swal.fire("Error", "Unable to load workspace projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === "active").length;
    const dueSoon = projects.filter((p) => {
      if (!p.endDate) return false;
      const diff =
        (new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff <= 10 && diff >= 0;
    }).length;
    return { total, active, dueSoon };
  }, [projects]);

  return (
    <section className="workspace-shell">
      <header className="workspace-shell__header">
        <div>
          <p className="eyebrow">My workspace</p>
          <h1>Projects assigned</h1>
          <p>Stay aligned with project owners, milestones, and teammates.</p>
        </div>
        <div className="workspace-shell__actions">
          {onBack && (
            <button className="btn ghost" onClick={onBack}>
              <FiArrowLeft /> Back
            </button>
          )}
          <button className="btn ghost" onClick={fetchProjects}>
            <FiRefreshCw /> Sync
          </button>
        </div>
      </header>

      <section className="workspace-stats">
        <div className="workspace-stat">
          <FiUsers />
          <div>
            <span>Assigned projects</span>
            <strong>{stats.total}</strong>
          </div>
        </div>
        <div className="workspace-stat">
          <FiLayers />
          <div>
            <span>Active now</span>
            <strong>{stats.active}</strong>
          </div>
        </div>
        <div className="workspace-stat">
          <FiCalendar />
          <div>
            <span>Due in 10 days</span>
            <strong>{stats.dueSoon}</strong>
          </div>
        </div>
      </section>

      <div className="workspace-grid">
        <div className="workspace-list-panel">
          <div className="workspace-list-panel__head">
            <input
              placeholder="Search project..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="workspace-empty">Loading workspace…</div>
          ) : filteredProjects.length === 0 ? (
            <div className="workspace-empty">
              No projects assigned. Reach out to your manager for access.
            </div>
          ) : (
            <ul className="workspace-project-list">
              {filteredProjects.map((project) => (
                <li
                  key={project._id}
                  className={
                    selectedProject?._id === project._id ? "is-active" : ""
                  }
                >
                  <button onClick={() => setSelectedProject(project)}>
                    <div>
                      <p className="eyebrow">{project.code || "Project"}</p>
                      <strong>{project.name}</strong>
                      <small>{project.description || "No summary yet"}</small>
                    </div>
                    <FiChevronRight />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="workspace-detail-panel">
          {!selectedProject ? (
            <div className="workspace-empty">Select a project to view details</div>
          ) : (
            <>
              <div className="workspace-detail__hero">
                <div>
                  <p className="eyebrow">
                    {selectedProject.status} • {selectedProject.health}
                  </p>
                  <h2>{selectedProject.name}</h2>
                  <p>{selectedProject.description || "No description available"}</p>
                </div>
                <div className="workspace-timeframe">
                  <span>Timeline</span>
                  <strong>
                    {selectedProject.startDate
                      ? new Date(selectedProject.startDate).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short" }
                        )
                      : "—"}{" "}
                    →{" "}
                    {selectedProject.endDate
                      ? new Date(selectedProject.endDate).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short" }
                        )
                      : "—"}
                  </strong>
                </div>
              </div>

              <section className="workspace-detail__section">
                <div className="section-header">
                  <h4>Project owner</h4>
                  <span>
                    {selectedProject.projectManager?.name || "Not assigned"}
                  </span>
                </div>
                <div className="section-header">
                  <h4>Your teammates</h4>
                  <span>{selectedProject.teamMembers?.length || 0} people</span>
                </div>
                <ul className="workspace-team-list">
                  {(selectedProject.teamMembers || []).map((member) => (
                    <li key={member.user?._id || member.user}>
                      <div>
                        <strong>{member.user?.name || "Unknown"}</strong>
                        <p>{member.role || "Contributor"}</p>
                      </div>
                      <span>{member.responsibility || "General contributor"}</span>
                      <small>{member.allocation || 0}%</small>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="workspace-detail__section">
                <h4>Upcoming milestones</h4>
                {selectedProject.milestones?.length ? (
                  <ul className="workspace-milestones">
                    {selectedProject.milestones.map((milestone, index) => (
                      <li key={`${milestone.title}-${index}`}>
                        <div>
                          <FiFlag />
                          <div>
                            <strong>{milestone.title}</strong>
                            <p>
                              {milestone.dueDate
                                ? new Date(milestone.dueDate).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "No deadline"}
                            </p>
                          </div>
                        </div>
                        <span className={milestone.completed ? "done" : ""}>
                          {milestone.completed ? "Done" : "Planned"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="workspace-empty inline">
                    No milestones shared yet.
                  </p>
                )}
              </section>

              <section className="workspace-detail__section">
                <div className="section-header">
                  <h4>Workspace tools</h4>
                  <span>Quick start kits</span>
                </div>
                <div className="workspace-tools">
                  {WorkspaceTooling.map((tool) => (
                    <article key={tool.label}>
                      <FiTarget />
                      <div>
                        <strong>{tool.label}</strong>
                        <p>{tool.description}</p>
                      </div>
                      <button type="button">Open</button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyWorkspace;



