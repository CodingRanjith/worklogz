import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiPlus,
  FiUsers,
  FiCalendar,
  FiTarget,
  FiRefreshCw,
  FiUserPlus,
  FiAlertTriangle,
  FiSearch,
} from "react-icons/fi";
import { API_ENDPOINTS } from "../../utils/api";
import ProjectFormModal from "../../components/admin-dashboard/projects/ProjectFormModal";
import AssignMemberModal from "../../components/admin-dashboard/projects/AssignMemberModal";
import "./ProjectsWorkspace.css";

const ProjectsWorkspace = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ENDPOINTS.getProjectsAdmin, {
        headers: authHeaders,
      });
      const list = data.data || [];
      setProjects(list);
      if (list.length && !selectedProject) {
        setSelectedProject(list[0]);
      } else if (selectedProject) {
        const refreshed = list.find((item) => item._id === selectedProject._id);
        setSelectedProject(refreshed || list[0] || null);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
      Swal.fire("Error", "Unable to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.getUsers, {
        headers: authHeaders,
      });
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        (project.code || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesHealth =
        healthFilter === "all" || project.health === healthFilter;
      return matchesSearch && matchesStatus && matchesHealth;
    });
  }, [projects, search, statusFilter, healthFilter]);

  const workspaceStats = useMemo(() => {
    const active = projects.filter((p) => p.status === "active").length;
    const atRisk = projects.filter((p) => p.health === "at-risk").length;
    const upcoming = projects.filter((p) => {
      if (!p.endDate) return false;
      const date = new Date(p.endDate);
      const today = new Date();
      const diff = (date - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 14;
    }).length;
    return { total: projects.length, active, atRisk, upcoming };
  }, [projects]);

  const handleCreateProject = async (payload) => {
    setSubmitting(true);
    try {
      await axios.post(API_ENDPOINTS.createProject, payload, {
        headers: authHeaders,
      });
      Swal.fire("Success", "Project created", "success");
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
      Swal.fire("Error", error.response?.data?.message || "Unable to save project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignMember = async (payload) => {
    if (!assignTarget?._id) return;
    setSubmitting(true);
    try {
      await axios.post(
        API_ENDPOINTS.assignProjectMember(assignTarget._id),
        payload,
        { headers: authHeaders }
      );
      Swal.fire("Success", "Team member assigned", "success");
      setShowAssignModal(false);
      setAssignTarget(null);
      fetchProjects();
    } catch (error) {
      console.error("Failed to assign member", error);
      Swal.fire("Error", error.response?.data?.message || "Unable to assign member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (projectId, memberId) => {
    const confirm = await Swal.fire({
      title: "Remove teammate?",
      text: "They will lose access to this workspace project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(API_ENDPOINTS.removeProjectMember(projectId, memberId), {
        headers: authHeaders,
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to remove member", error);
      Swal.fire("Error", "Unable to remove teammate", "error");
    }
  };

  return (
    <div className="projects-workspace page-shell">
      <header className="projects-workspace__header">
        <div>
          <p className="eyebrow">Workspace control</p>
          <h1>Projects & Assignments</h1>
          <p>Track initiatives, owners, and billing-ready teams from one board.</p>
        </div>
        <div className="projects-workspace__actions">
          <button
            type="button"
            className="btn ghost"
            onClick={fetchProjects}
          >
            <FiRefreshCw />
            Refresh
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus />
            Add project
          </button>
        </div>
      </header>

      <section className="projects-workspace__stats">
        <div className="stats-card">
          <div className="icon blue">
            <FiUsers />
          </div>
          <div>
            <p>Total projects</p>
            <strong>{workspaceStats.total}</strong>
          </div>
        </div>
        <div className="stats-card">
          <div className="icon green">
            <FiTarget />
          </div>
          <div>
            <p>Active now</p>
            <strong>{workspaceStats.active}</strong>
          </div>
        </div>
        <div className="stats-card">
          <div className="icon amber">
            <FiCalendar />
          </div>
          <div>
            <p>Deadline (14d)</p>
            <strong>{workspaceStats.upcoming}</strong>
          </div>
        </div>
        <div className="stats-card">
          <div className="icon red">
            <FiAlertTriangle />
          </div>
          <div>
            <p>At risk</p>
            <strong>{workspaceStats.atRisk}</strong>
          </div>
        </div>
      </section>

      <section className="projects-workspace__filters">
        <div className="search-field">
          <FiSearch />
          <input
            placeholder="Search by name or code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On hold</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={healthFilter}
          onChange={(event) => setHealthFilter(event.target.value)}
        >
          <option value="all">All health</option>
          <option value="on-track">On track</option>
          <option value="at-risk">At risk</option>
          <option value="off-track">Off track</option>
        </select>
      </section>

      <div className="projects-workspace__grid">
        <div className="projects-board">
          {loading ? (
            <div className="empty-state">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects match your filters.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <article
                key={project._id}
                className={`project-card ${
                  selectedProject?._id === project._id ? "is-active" : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card__head">
                  <div>
                    <p className="eyebrow">{project.code || "—"}</p>
                    <h3>{project.name}</h3>
                  </div>
                  <span className={`badge status ${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-card__desc">
                  {project.description || "No description provided"}
                </p>
                <footer className="project-card__footer">
                  <span>
                    <FiUsers /> {project.teamMembers?.length || 0} members
                  </span>
                  <span>
                    <FiCalendar />{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "No due date"}
                  </span>
                  <span className={`badge health ${project.health}`}>
                    {project.health}
                  </span>
                </footer>
              </article>
            ))
          )}
        </div>

        <div className="project-detail">
          {!selectedProject ? (
            <div className="empty-state">Select a project to inspect</div>
          ) : (
            <>
              <header>
                <div>
                  <p className="eyebrow">Project overview</p>
                  <h2>{selectedProject.name}</h2>
                </div>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    setAssignTarget(selectedProject);
                    setShowAssignModal(true);
                  }}
                >
                  <FiUserPlus />
                  Assign teammate
                </button>
              </header>

              <section className="project-meta">
                <div>
                  <span>Project manager</span>
                  <strong>
                    {selectedProject.projectManager?.name || "Not assigned"}
                  </strong>
                </div>
                <div>
                  <span>Timeline</span>
                  <strong>
                    {selectedProject.startDate
                      ? new Date(selectedProject.startDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}{" "}
                    →{" "}
                    {selectedProject.endDate
                      ? new Date(selectedProject.endDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </strong>
                </div>
                <div>
                  <span>Priority</span>
                  <strong className={`badge priority ${selectedProject.priority}`}>
                    {selectedProject.priority}
                  </strong>
                </div>
              </section>

              <section className="project-notes">
                <h4>Summary</h4>
                <p>{selectedProject.description || "No notes yet."}</p>

                {selectedProject.tags?.length ? (
                  <div className="tag-row">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>

              <section className="project-team">
                <div className="section-head">
                  <h4>Assigned team</h4>
                  <span>{selectedProject.teamMembers?.length || 0} people</span>
                </div>

                {selectedProject.teamMembers?.length ? (
                  <ul>
                    {selectedProject.teamMembers.map((member) => (
                      <li key={member.user?._id || member.user}>
                        <div>
                          <strong>{member.user?.name || "Unknown"}</strong>
                          <p>{member.role || "Contributor"}</p>
                        </div>
                        <div>
                          <span>{member.responsibility || "—"}</span>
                          <small>{member.allocation || 0}%</small>
                        </div>
                        <button
                          type="button"
                          className="link danger"
                          onClick={() =>
                            handleRemoveMember(
                              selectedProject._id,
                              member.user?._id || member.user
                            )
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No members yet</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <ProjectFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        users={users}
        submitting={submitting}
      />

      <AssignMemberModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssignTarget(null);
        }}
        onSubmit={handleAssignMember}
        users={users}
        existingMembers={assignTarget?.teamMembers || []}
        submitting={submitting}
      />
    </div>
  );
};

export default ProjectsWorkspace;


