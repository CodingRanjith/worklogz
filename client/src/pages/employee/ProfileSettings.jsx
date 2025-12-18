import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/api";
import Swal from "sweetalert2";
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

function ProfileSettings() {
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formatEmployeeId = (value) => {
    if (!value) return "";
    const clean = value.toString().replace(/^thc\s*:?\s*/i, "").trim();
    const digits = clean.replace(/\D/g, '');
    if (digits) {
      const padded = digits.padStart(3, '0');
      return `THC${padded}`;
    }
    return clean || "";
  };

  const mapUserToProfile = (data) => ({
    id: data?._id || data?.id || "",
    name: data?.name || "",
    employeeId: formatEmployeeId(data?.employeeId || data?.employeeCode || ""),
    email: data?.email || "",
    phone: data?.phone || "",
    position: data?.position || "",
    department: data?.department || "",
    company: data?.company || "",
    location: data?.location || "",
    gender: data?.gender || "",
    dob: data?.dateOfBirth || "",
    maritalStatus: data?.maritalStatus || "",
    avatar: data?.profilePic || "",
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(API_ENDPOINTS.getCurrentUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = mapUserToProfile(res.data);
      setForm({ ...EMPTY_PROFILE, ...profileData });
      setAvatarPreview(profileData.avatar || "");
    } catch (err) {
      console.error("Unable to load user info", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load profile data",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
    setAvatarPreview(form.avatar || "");
    setForm((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found",
      });
      return;
    }

    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Required",
          text: "Please enter your current password",
        });
        return;
      }
      if (!form.newPassword) {
        Swal.fire({
          icon: "error",
          title: "New Password Required",
          text: "Please enter a new password",
        });
        return;
      }
      if (form.newPassword.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must be at least 6 characters long",
        });
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "New password and confirm password do not match",
        });
        return;
      }
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    const fieldMap = {
      name: "name",
      email: "email",
      phone: "phone",
      position: "position",
      department: "department",
      company: "company",
      location: "location",
      employeeId: "employeeId",
      gender: "gender",
      maritalStatus: "maritalStatus",
      dob: "dateOfBirth",
    };

    Object.entries(fieldMap).forEach(([formKey, apiKey]) => {
      let value = form[formKey];
      if (value !== undefined && value !== null && value !== "") {
        if (formKey === "employeeId") {
          value = formatEmployeeId(value);
        }
        formData.append(apiKey, value);
      }
    });

    if (form.currentPassword) {
      formData.append("currentPassword", form.currentPassword);
    }
    if (form.newPassword) {
      formData.append("newPassword", form.newPassword);
    }

    if (avatarFile) {
      formData.append("profilePic", avatarFile);
    } else if (form.avatar !== undefined && !avatarFile) {
      formData.append("profilePic", form.avatar);
    }

    try {
      setIsSaving(true);
      const { data } = await axios.put(
        API_ENDPOINTS.updateMyProfile,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updated = data?.user ? mapUserToProfile(data.user) : form;
      setForm({ ...EMPTY_PROFILE, ...updated, currentPassword: "", newPassword: "", confirmPassword: "" });
      setAvatarPreview(updated.avatar || "");
      setAvatarFile(null);
      setShowPasswordFields(false);
      
      Swal.fire({
        icon: "success",
        title: form.newPassword ? "Profile and password updated" : "Profile updated",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update profile", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayInitial = form.name ? form.name.charAt(0).toUpperCase() : "U";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-6 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Settings</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Profile Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your personal information and account settings</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form p-6">
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
                onClick={() => {
                  fetchUser();
                  setShowPasswordFields(false);
                }}
                disabled={isSaving}
              >
                Reset
              </button>
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;

