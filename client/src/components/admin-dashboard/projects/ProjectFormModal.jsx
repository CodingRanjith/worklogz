import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const statusOptions = [
  { label: "Planning", value: "planning" },
  { label: "Active", value: "active" },
  { label: "On hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
  { label: "Archived", value: "archived" },
];

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const healthOptions = [
  { label: "On track", value: "on-track" },
  { label: "At risk", value: "at-risk" },
  { label: "Off track", value: "off-track" },
];

const defaultForm = {
  name: "",
  code: "",
  client: "",
  description: "",
  status: "planning",
  priority: "medium",
  health: "on-track",
  startDate: "",
  endDate: "",
  projectManager: "",
  tags: "",
};

const ProjectFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  users = [],
  submitting = false,
}) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        startDate: initialData.startDate
          ? initialData.startDate.substring(0, 10)
          : "",
        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : "",
        tags: (initialData.tags || []).join(", "),
        projectManager: initialData.projectManager?._id || initialData.projectManager || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
    };

    if (!payload.projectManager) {
      delete payload.projectManager;
    }

    if (!payload.code) {
      delete payload.code;
    }

    onSubmit?.(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-shell">
      <div className="modal-card">
        <header className="modal-card__header">
          <div>
            <h3>{initialData ? "Update project" : "Create project"}</h3>
            <p>Add a new initiative with owner, dates, and status</p>
          </div>
          <button type="button" className="ghost-icon" onClick={onClose}>
            <FiX size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="grid two-col gap">
            <label className="field">
              <span>Project name *</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Worklogz Revamp"
                required
              />
            </label>
            <label className="field">
              <span>Project code</span>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="WRK-001"
              />
            </label>
          </div>

          <div className="grid two-col gap">
            <label className="field">
              <span>Client / business unit</span>
              <input
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Internal"
              />
            </label>
            <label className="field">
              <span>Project manager</span>
              <select
                name="projectManager"
                value={form.projectManager}
                onChange={handleChange}
              >
                <option value="">Select team member</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.employeeId || "—"})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief about deliverables, objectives, etc."
            />
          </label>

          <div className="grid three-col gap">
            <label className="field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {priorityOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Health</span>
              <select name="health" value={form.health} onChange={handleChange}>
                {healthOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid two-col gap">
            <label className="field">
              <span>Start date</span>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </label>
            <label className="field">
              <span>Target date</span>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="field">
            <span>Tags (comma separated)</span>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="product, ui, payroll"
            />
          </label>

          <footer className="modal-card__footer">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Saving..." : initialData ? "Update project" : "Create project"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;



