import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/api";
import "./CommunityHub.css";

const CommunityHub = ({
  users,
  onBack,
  groups,
  setGroups,
  activeGroupId,
  setActiveGroupId,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("token");

  const activeGroup = useMemo(
    () => groups.find((group) => group._id === activeGroupId) || groups[0],
    [groups, activeGroupId]
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (!activeGroup) return;
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const { data } = await axios.get(
          API_ENDPOINTS.getCommunityMessages(activeGroup._id),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeGroup?._id]);

  const resetForm = () => {
    setGroupForm({ name: "", description: "", members: [] });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name || groupForm.members.length === 0) return;
    try {
      const payload = {
        name: groupForm.name,
        description: groupForm.description,
        memberIds: groupForm.members,
      };
      const { data } = await axios.post(
        API_ENDPOINTS.createCommunityGroup,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.group) {
        setGroups((prev) => [data.group, ...prev]);
        setActiveGroupId(data.group._id);
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !activeGroup) return;
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.postCommunityMessage(activeGroup._id),
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.record) {
        setMessages((prev) => [...prev, data.record]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!activeGroup) return;
    const confirmDelete = window.confirm(
      `Delete ${activeGroup.name}? This will remove all messages.`
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(API_ENDPOINTS.deleteCommunityGroup(activeGroup._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups((prev) => prev.filter((g) => g._id !== activeGroup._id));
      setActiveGroupId(null);
      setMessages([]);
    } catch (error) {
      console.error("Failed to delete group", error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup) return;
    const confirmLeave = window.confirm(
      `Leave ${activeGroup.name}? You will no longer receive updates.`
    );
    if (!confirmLeave) return;
    try {
      await axios.post(
        API_ENDPOINTS.leaveCommunityGroup(activeGroup._id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups((prev) =>
        prev.filter((group) => group._id !== activeGroup._id)
      );
      setActiveGroupId(null);
      setMessages([]);
    } catch (error) {
      console.error("Failed to leave group", error);
    }
  };

  const isMemberSelected = (id) => groupForm.members.includes(id);
  const toggleMember = (id) => {
    setGroupForm((prev) => {
      if (prev.members.includes(id)) {
        return { ...prev, members: prev.members.filter((m) => m !== id) };
      }
      return { ...prev, members: [...prev.members, id] };
    });
  };

  return (
    <section className="community-hub">
      <header className="community-hub__header">
        <div>
          <p className="community-hub__eyebrow">Community</p>
          <h2>Team spaces & chat</h2>
          <p>
            Organize groups, keep everyone aligned, and see who’s online before
            you drop a message.
          </p>
        </div>
        <div className="community-hub__actions">
          <button className="btn ghost" onClick={onBack}>
            ← Back to dashboard
          </button>
          <button className="btn primary" onClick={() => setShowForm((p) => !p)}>
            {showForm ? "Close form" : "+ Create group"}
          </button>
        </div>
      </header>

      {showForm && (
        <form className="community-hub__form" onSubmit={handleCreateGroup}>
          <div>
            <label>Group name</label>
            <input
              type="text"
              value={groupForm.name}
              onChange={(e) =>
                setGroupForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              rows={2}
              value={groupForm.description}
              onChange={(e) =>
                setGroupForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div>
            <label>Select members</label>
            <div className="community-hub__member-grid">
              {users.map((user) => (
                <button
                  type="button"
                  key={user._id}
                  className={`community-hub__member ${
                    isMemberSelected(user._id) ? "is-selected" : ""
                  }`}
                  onClick={() => toggleMember(user._id)}
                >
                  <img
                    src={
                      user.profilePic ||
                      "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                    }
                    alt={user.name}
                  />
                  <span>{user.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn primary">
            Create group
          </button>
        </form>
      )}

      <div className="community-hub__body">
        <aside>
          <h4>Your groups</h4>
          <div className="community-hub__groups">
            {groups.length === 0 ? (
              <div className="community-hub__placeholder">
                Create your first group to get started.
              </div>
            ) : (
              groups.map((group) => (
                <button
                  key={group._id}
                  type="button"
                  className={`community-group-tile ${
                    activeGroup?._id === group._id ? "is-active" : ""
                  }`}
                  onClick={() => setActiveGroupId(group._id)}
                >
                  <div>
                    <p>{group.name}</p>
                    <small>{group.description || "No description"}</small>
                  </div>
                  <span>{group.members.length} members</span>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="community-hub__chat">
          {!activeGroup ? (
            <div className="community-hub__placeholder">
              Select a group to view messages.
            </div>
          ) : (
            <>
              <header>
                <div className="community-hub__chat-title">
                  <h3>{activeGroup.name}</h3>
                  {activeGroup.createdBy?._id === currentUserId ? (
                    <button className="btn danger" onClick={handleDeleteGroup}>
                      Delete
                    </button>
                  ) : (
                    <button className="btn ghost" onClick={handleLeaveGroup}>
                      Leave
                    </button>
                  )}
                </div>
                <div className="community-hub__avatars">
                  {activeGroup.members.map((member) => (
                    <div key={member._id} className="community-hub__avatar">
                      <span
                        className={`status-dot ${
                          member.isActive ? "online" : "offline"
                        }`}
                      />
                      <img
                        src={
                          member.profilePic ||
                          "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                        }
                        alt={member.name}
                        title={`${member.name} • ${member.isActive ? "Online" : "Offline"}`}
                      />
                    </div>
                  ))}
                </div>
              </header>
              <p className="community-hub__chat-subtitle">
                {activeGroup.description || "Group conversation"}
              </p>

              <div className="community-hub__messages">
                {loadingMessages ? (
                  <div className="community-hub__placeholder">
                    Loading conversation…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="community-hub__placeholder">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg._id} className="community-message">
                      <img
                        src={
                          msg.sender?.profilePic ||
                          "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                        }
                        alt={msg.sender?.name}
                      />
                      <div>
                        <div className="community-message__meta">
                          <strong>{msg.sender?.name || "User"}</strong>
                          <span>
                            {new Date(msg.createdAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="community-hub__composer" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn primary">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityHub;

