import React, { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

const AssignMemberModal = ({
  open,
  onClose,
  onSubmit,
  users = [],
  existingMembers = [],
  submitting = false,
}) => {
  const [form, setForm] = useState({
    userId: "",
    role: "Contributor",
    responsibility: "",
    allocation: 100,
  });

  const existingIds = useMemo(
    () => existingMembers.map((member) => member.user?._id || member.user),
    [existingMembers]
  );

  const availableUsers = useMemo(() => {
    if (!open) return [];
    return users.filter((user) => !existingIds.includes(user._id));
  }, [existingIds, users, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.userId) return;
    onSubmit?.({
      userId: form.userId,
      role: form.role,
      responsibility: form.responsibility,
      allocation: Number(form.allocation),
    });
  };

  if (!open) return null;

  return (
    <div className="modal-shell">
      <div className="modal-card">
        <header className="modal-card__header">
          <div>
            <h3>Assign teammate</h3>
            <p>Invite a colleague to the project and define their responsibility</p>
          </div>
          <button type="button" className="ghost-icon" onClick={onClose}>
            <FiX size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Select team member *</span>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
            >
              <option value="">Choose employee</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.employeeId || "—"})
                </option>
              ))}
            </select>
          </label>

          <div className="grid two-col gap">
            <label className="field">
              <span>Role</span>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Product Designer"
              />
            </label>
            <label className="field">
              <span>Allocation %</span>
              <input
                type="number"
                min="10"
                max="100"
                step="10"
                name="allocation"
                value={form.allocation}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="field">
            <span>Responsibility</span>
            <textarea
              name="responsibility"
              value={form.responsibility}
              onChange={handleChange}
              rows={3}
              placeholder="What will this member deliver?"
            />
          </label>

          <footer className="modal-card__footer">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Assigning..." : "Assign member"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AssignMemberModal;



