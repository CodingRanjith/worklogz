import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS, BASE_URL } from "../../utils/api";
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
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const activeGroup = useMemo(
    () => groups.find((group) => group._id === activeGroupId) || groups[0],
    [groups, activeGroupId]
  );

  // Initialize user ID from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.id || decoded._id;
        if (userId) {
          setCurrentUserId(userId.toString());
          console.log("Current user ID set:", userId.toString());
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        // Fallback: try to get from API
        axios.get(API_ENDPOINTS.getCurrentUser, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          if (response.data?._id) {
            setCurrentUserId(response.data._id.toString());
            console.log("Current user ID from API:", response.data._id.toString());
          }
        }).catch(err => {
          console.error("Failed to fetch current user:", err);
        });
      }
    }
  }, []);

  // Initialize Socket.io connection
  useEffect(() => {
    if (!token) return;

    const newSocket = io(BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    newSocket.on('new-message', (data) => {
      if (data.message && data.groupId === activeGroupId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(msg => msg._id === data.message._id)) {
            return prev;
          }
          return [...prev, data.message];
        });
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    newSocket.on('user-typing', (data) => {
      if (data.groupId === activeGroupId && data.userId !== currentUserId) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: data.isTyping ? data.userName : null,
        }));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, currentUserId, activeGroupId]);

  // Join all groups when socket connects and groups are available
  useEffect(() => {
    if (socket?.connected && groups.length > 0) {
      const groupIds = groups.map(g => g._id);
      socket.emit('join-groups', groupIds);
      console.log('Joined groups:', groupIds);
    }
  }, [socket?.connected, groups]);

  // Join active group room when it changes
  useEffect(() => {
    if (socket && activeGroupId) {
      socket.emit('join-group', activeGroupId);
    }
  }, [socket, activeGroupId]);

  // Fetch messages when active group changes
  useEffect(() => {
    if (!activeGroup || !token) return;
    
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setMessages([]);
        const { data } = await axios.get(
          API_ENDPOINTS.getCommunityMessages(activeGroup._id),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data || []);
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [activeGroup?._id, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear typing indicator after timeout
  useEffect(() => {
    const typingUserIds = Object.keys(typingUsers).filter(
      (userId) => typingUsers[userId] !== null
    );
    if (typingUserIds.length > 0) {
      const timeout = setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          typingUserIds.forEach((userId) => {
            updated[userId] = null;
          });
          return updated;
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [typingUsers]);

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
        
        // Join new group via socket
        if (socket) {
          socket.emit('join-group', data.group._id);
        }
        
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeGroup || !token) return;
    
    const messageText = newMessage.trim();
    setNewMessage("");
    
    // Stop typing indicator
    if (socket && activeGroupId) {
      socket.emit('typing', { groupId: activeGroupId, isTyping: false });
      setIsTyping(false);
    }
    
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.postCommunityMessage(activeGroup._id),
        { text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Message will be added via socket event, but add optimistically
      if (data.record && !messages.some(msg => msg._id === data.record._id)) {
        setMessages((prev) => [...prev, data.record]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
      // Restore message on error
      setNewMessage(messageText);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!socket || !activeGroupId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If user is not typing, emit typing event
    if (!isTyping && value.length > 0) {
      socket.emit('typing', { groupId: activeGroupId, isTyping: true });
      setIsTyping(true);
    }

    // Clear typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && activeGroupId) {
        socket.emit('typing', { groupId: activeGroupId, isTyping: false });
        setIsTyping(false);
      }
    }, 2000);
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
      
      // Leave socket room
      if (socket) {
        socket.emit('leave-group', activeGroup._id);
      }
      
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypingText = () => {
    const typingNames = Object.values(typingUsers).filter(name => name !== null);
    if (typingNames.length === 0) return null;
    if (typingNames.length === 1) return `${typingNames[0]} is typing...`;
    if (typingNames.length === 2) return `${typingNames[0]} and ${typingNames[1]} are typing...`;
    return `${typingNames[0]} and ${typingNames.length - 1} others are typing...`;
  };

  return (
    <section className="community-hub">
      <header className="community-hub__header">
        <div>
          <p className="community-hub__eyebrow">Community</p>
          <h2>Team spaces & chat</h2>
          <p>
            Real-time messaging with WhatsApp-like experience. Messages on the left, members on the right.
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
        {/* Left Side - Groups List */}
        <aside className="community-hub__sidebar">
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

        {/* Center - Chat Area */}
        <div className="community-hub__chat">
          {!activeGroup ? (
            <div className="community-hub__placeholder">
              Select a group to view messages.
            </div>
          ) : (
            <>
              <header className="community-hub__chat-header">
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
              <p className="community-hub__chat-subtitle">
                {activeGroup.description || "Group conversation"}
              </p>
              </header>

              <div className="community-hub__messages-container">
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
                    <>
                      {messages.map((msg) => {
                        // Compare sender ID with current user ID (handle both string and ObjectId formats)
                        const senderId = msg.sender?._id?.toString() || msg.sender?._id?.toString?.() || String(msg.sender?._id || '');
                        const myId = String(currentUserId || '');
                        const isMyMessage = senderId === myId && senderId !== '';
                        
                        // Debug log (remove in production)
                        if (process.env.NODE_ENV === 'development') {
                          console.log('Message comparison:', {
                            senderId,
                            myId,
                            isMyMessage,
                            senderName: msg.sender?.name
                          });
                        }
                        
                        return (
                          <div
                            key={msg._id}
                            className={`whatsapp-message ${isMyMessage ? "whatsapp-message--sent" : "whatsapp-message--received"}`}
                          >
                            {!isMyMessage && (
                              <img
                                className="whatsapp-message__avatar"
                        src={
                          msg.sender?.profilePic ||
                          "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                        }
                        alt={msg.sender?.name}
                      />
                            )}
                            <div className="whatsapp-message__bubble">
                              {!isMyMessage && (
                                <span className="whatsapp-message__sender-name">
                                  {msg.sender?.name || "User"}
                                </span>
                              )}
                              <p className="whatsapp-message__text">{msg.text}</p>
                              <span className="whatsapp-message__time">
                                {formatTime(msg.createdAt)}
                          </span>
                        </div>
                          </div>
                        );
                      })}
                      {getTypingText() && (
                        <div className="whatsapp-message whatsapp-message--received">
                          <div className="whatsapp-message__bubble whatsapp-message__bubble--typing">
                            <span className="typing-indicator">{getTypingText()}</span>
                      </div>
                    </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                )}
                </div>
              </div>

              <form className="community-hub__composer" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button type="submit" className="btn primary" disabled={!newMessage.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right Side - Members List */}
        {activeGroup && (
          <aside className="community-hub__members-sidebar">
            <h4>Members ({activeGroup.members?.length || 0})</h4>
            <div className="community-hub__members-list">
              {activeGroup.members?.map((member) => (
                <div key={member._id} className="community-hub__member-item">
                  <div className="community-hub__member-avatar-wrapper">
                    <img
                      src={
                        member.profilePic ||
                        "https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png"
                      }
                      alt={member.name}
                    />
                    <span
                      className={`status-dot ${
                        member.isActive ? "online" : "offline"
                      }`}
                    />
                  </div>
                  <div className="community-hub__member-info">
                    <p className="community-hub__member-name">{member.name}</p>
                    <span className="community-hub__member-position">
                      {member.position || "Team member"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};

export default CommunityHub;