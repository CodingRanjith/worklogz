import { useEffect, useState } from "react";
import "./ProfileCard.css";

const EMPTY_PROFILE = {
  id: "",
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  company: "",
  location: "",
  gender: "",
  dob: "",
  maritalStatus: "",
  avatar: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfileCard({
  isOpen,
  profile = EMPTY_PROFILE,
  onClose,
  onSave,
  isSaving,
}) {
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY_PROFILE, ...profile, currentPassword: "", newPassword: "", confirmPassword: "" });
      setAvatarPreview(profile?.avatar || "");
      setAvatarFile(null);
      setShowPasswordFields(false);
    }
  }, [isOpen, profile]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarRemove = () => {
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    setForm((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form, avatarFile);
  };

  const displayInitial = form.name ? form.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-editor-overlay">
      <div className="profile-editor-panel">
        <div className="profile-editor-header">
          <div>
            <p className="profile-eyebrow">Profile</p>
            <h2>Edit profile</h2>
          </div>
          <button type="button" className="plain-link" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <section className="profile-section">
            <div className="section-header">
              <div>
                <h3>Basic information</h3>
                <p>Keep your name and identification details up to date.</p>
              </div>
              <div className="avatar-uploader">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={form.name || "Profile"} />
                  ) : (
                    <span>{displayInitial}</span>
                  )}
                </div>
                <div className="avatar-actions">
                  <label className="avatar-upload-trigger">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      className="plain-link small"
                      onClick={handleAvatarRemove}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="avatar-helper">JPG or PNG, up to 5MB.</p>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </label>
              <label>
                <span>Employee ID</span>
                <input
                  type="text"
                  value={form.employeeId}
                  disabled
                  className="read-only-input"
                  title="Managed by HR"
                />
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-header">
              <div>
                <h3>Contact</h3>
                <p>How HR and teammates reach you.</p>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled
                  className="read-only-input"
                  title="Managed by HR"
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </label>
              <label>
                <span>Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-header">
              <div>
                <h3>Company</h3>
                <p>Your current role inside the organisation.</p>
              </div>
            </div>

            <div className="role-callout">
              <p>
                These details are maintained by HR to ensure payroll & compliance
                accuracy. Contact your administrator if something looks off.
              </p>
              <div className="role-callout__grid">
                <article>
                  <span>Company</span>
                  <strong>{form.company || "Techackode"}</strong>
                  <small>Managed centrally</small>
                </article>
                <article>
                  <span>Department</span>
                  <strong>{form.department || "Director"}</strong>
                  <small>Aligned to reporting structure</small>
                </article>
                <article>
                  <span>Position</span>
                  <strong>{form.position || "—"}</strong>
                  <small>Read-only for employees</small>
                </article>
              </div>
            </div>

            <div className="field-grid">
              <label>
                <span>Company</span>
                <input
                  type="text"
                  value={form.company}
                  disabled
                  className="read-only-input"
                  title="Managed by HR"
                />
              </label>
              <label>
                <span>Department</span>
                <input
                  type="text"
                  value={form.department}
                  disabled
                  className="read-only-input"
                  title="Managed by HR"
                />
              </label>
              <label>
                <span>Position</span>
                <input
                  type="text"
                  value={form.position}
                  disabled
                  className="read-only-input"
                  title="Managed by HR"
                />
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-header">
              <div>
                <h3>Personal</h3>
                <p>Details used for identity records.</p>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>Gender</span>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                <span>Date of birth</span>
                <input
                  type="date"
                  value={form.dob || ""}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </label>
              <label>
                <span>Marital status</span>
                <select
                  value={form.maritalStatus}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                </select>
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-header">
              <div>
                <h3>Security</h3>
                <p>Change your password to keep your account secure.</p>
              </div>
            </div>
            <div className="field-grid">
              {!showPasswordFields ? (
                <div style={{ gridColumn: "1 / -1" }}>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setShowPasswordFields(true)}
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <>
                  <label>
                    <span>Current Password</span>
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={(e) => handleChange("currentPassword", e.target.value)}
                      placeholder="Enter current password"
                    />
                  </label>
                  <label>
                    <span>New Password</span>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(e) => handleChange("newPassword", e.target.value)}
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </label>
                  <label>
                    <span>Confirm New Password</span>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </label>
                  {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
                    <div style={{ gridColumn: "1 / -1", color: "#ef4444", fontSize: "0.875rem" }}>
                      Passwords do not match
                    </div>
                  )}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <button
                      type="button"
                      className="plain-link small"
                      onClick={() => {
                        setShowPasswordFields(false);
                        handleChange("currentPassword", "");
                        handleChange("newPassword", "");
                        handleChange("confirmPassword", "");
                      }}
                    >
                      Cancel password change
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="profile-editor-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button className="primary-btn" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}