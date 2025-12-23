import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  FiAlertCircle,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSend,
  FiUserCheck,
} from "react-icons/fi";
import { API_ENDPOINTS } from "../../utils/api";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "technical", label: "Technical" },
  { value: "payroll", label: "Payroll" },
  { value: "hr", label: "HR" },
  { value: "it", label: "IT" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const PRIORITY_BADGES = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-blue-50 text-blue-700 border-blue-100",
  high: "bg-amber-50 text-amber-700 border-amber-100",
  urgent: "bg-rose-50 text-rose-700 border-rose-100",
};

const STATUS_BADGES = {
  open: "bg-slate-100 text-slate-800 border-slate-200",
  "in-progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "mine", label: "My tickets" },
];

const HelpdeskCenter = ({ variant = "full", onBack }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [summary, setSummary] = useState({ open: 0, inProgress: 0, resolved: 0, mine: 0 });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [sending, setSending] = useState(false);
  const [filters, setFilters] = useState("all");
  const [showComposer, setShowComposer] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [form, setForm] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
    message: "",
  });

  const token = localStorage.getItem("token");
  const authHeaders = useMemo(() => {
    if (!token) return null;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const currentUser = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }, [token]);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "master-admin";

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket._id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      switch (filters) {
        case "open":
          return ticket.status === "open";
        case "in-progress":
          return ticket.status === "in-progress";
        case "resolved":
          return ticket.status === "resolved" || ticket.status === "closed";
        case "mine":
          return (
            ticket.createdBy?._id === currentUser?.userId ||
            ticket.assignedTo?._id === currentUser?.userId
          );
        default:
          return true;
      }
    });
  }, [tickets, filters, currentUser?.userId]);

  const handleError = (message, error) => {
    console.error(message, error);
    Swal.fire({
      icon: "error",
      title: "Helpdesk",
      text: error?.response?.data?.msg || message,
    });
  };

  const fetchTickets = async () => {
    if (!authHeaders) return;
    setLoading(true);
    try {
      const { data } = await axios.get(API_ENDPOINTS.getHelpdeskTickets, authHeaders);
      setTickets(data);
      if (!selectedTicketId && data.length) {
        setSelectedTicketId(data[0]._id);
      } else if (selectedTicketId) {
        const stillExists = data.some((ticket) => ticket._id === selectedTicketId);
        if (!stillExists) {
          setSelectedTicketId(data[0]?._id || null);
        }
      }
    } catch (error) {
      handleError("Failed to load helpdesk tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!authHeaders) return;
    try {
      const { data } = await axios.get(API_ENDPOINTS.getHelpdeskSummary, authHeaders);
      setSummary(data);
    } catch (error) {
      console.warn("Failed to load summary", error);
    }
  };

  const fetchContacts = async () => {
    if (!authHeaders) return;
    try {
      const { data } = await axios.get(API_ENDPOINTS.getHelpdeskContacts, authHeaders);
      setContacts(data);
    } catch (error) {
      console.warn("Failed to load contacts", error);
    }
  };

  useEffect(() => {
    if (!authHeaders) return;
    fetchTickets();
    fetchSummary();
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  const handleFormChange = (evt) => {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (evt) => {
    evt.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Helpdesk",
        text: "Subject and description are required.",
      });
    }

    setCreating(true);
    try {
      await axios.post(
        API_ENDPOINTS.createHelpdeskTicket,
        {
          subject: form.subject.trim(),
          description: form.description.trim(),
          category: form.category,
          priority: form.priority,
          message: form.message?.trim(),
        },
        authHeaders
      );

      Swal.fire({
        icon: "success",
        title: "Ticket created",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        subject: "",
        category: "general",
        priority: "medium",
        description: "",
        message: "",
      });
      setShowComposer(false);
      await fetchTickets();
      await fetchSummary();
    } catch (error) {
      handleError("Unable to create ticket", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicketId || !newMessage.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.postHelpdeskMessage(selectedTicketId),
        { message: newMessage.trim() },
        authHeaders
      );
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === data._id ? data : ticket))
      );
      setNewMessage("");
    } catch (error) {
      handleError("Failed to send message", error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!isAdmin || !selectedTicketId) return;
    setUpdating(true);
    try {
      const { data } = await axios.patch(
        API_ENDPOINTS.updateHelpdeskTicketStatus(selectedTicketId),
        { status },
        authHeaders
      );
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === data._id ? data : ticket))
      );
      await fetchSummary();
    } catch (error) {
      handleError("Unable to update ticket status", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!isAdmin || !selectedTicketId || !currentUser?.userId) return;
    setUpdating(true);
    try {
      const { data } = await axios.patch(
        API_ENDPOINTS.updateHelpdeskTicketStatus(selectedTicketId),
        { assignedTo: currentUser.userId },
        authHeaders
      );
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === data._id ? data : ticket))
      );
    } catch (error) {
      handleError("Unable to assign ticket", error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerClasses =
    variant === "inline"
      ? "bg-white border shadow-sm rounded-3xl p-4 sm:p-6"
      : "bg-white border shadow-sm rounded-3xl p-4 sm:p-6 md:p-8";

  if (!token) {
    return (
      <div className={containerClasses}>
        <p className="text-center text-gray-600">
          Please log in to access the helpdesk.
        </p>
      </div>
    );
  }

  return (
    <section className={containerClasses}>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-500 font-semibold">
            Helpdesk
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Support tickets & real-time updates
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin
              ? "Monitor, assign, and resolve incoming employee requests."
              : "Track your requests, share updates, and reach the support team faster."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={fetchTickets}
            className="px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowComposer((prev) => !prev)}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-indigo-500 transition"
          >
            <FiPlus className="w-4 h-4" />
            New ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <article className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500 uppercase">Open</p>
          <p className="text-2xl font-semibold text-slate-900">{summary.open ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <p className="text-xs font-medium text-indigo-500 uppercase">In progress</p>
          <p className="text-2xl font-semibold text-indigo-900">
            {summary.inProgress ?? 0}
          </p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-xs font-medium text-emerald-500 uppercase">Resolved</p>
          <p className="text-2xl font-semibold text-emerald-900">
            {summary.resolved ?? 0}
          </p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-500 uppercase">My tickets</p>
          <p className="text-2xl font-semibold text-amber-900">{summary.mine ?? 0}</p>
        </article>
      </div>

      {showComposer && (
        <form
          onSubmit={handleCreateTicket}
          className="mb-8 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-indigo-900">Create new ticket</h3>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-500"
              onClick={() => setShowComposer(false)}
            >
              Close
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-indigo-900">
              Subject
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Summarize your request"
              />
            </label>
            <label className="text-sm font-medium text-indigo-900">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-indigo-900">
              Priority
              <select
                name="priority"
                value={form.priority}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm font-medium text-indigo-900 block">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              rows={3}
              className="mt-1 w-full rounded-3xl border border-indigo-200 bg-white px-4 py-2 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Share key details that will help us resolve your issue"
            />
          </label>
          <label className="text-sm font-medium text-indigo-900 block">
            First message (optional)
            <textarea
              name="message"
              value={form.message}
              onChange={handleFormChange}
              rows={2}
              className="mt-1 w-full rounded-3xl border border-indigo-200 bg-white px-4 py-2 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Provide any context or screenshots (links)"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Submitting..." : "Submit ticket"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilters(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  filters === filter.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-gray-500 animate-pulse">Loading tickets...</p>
            ) : filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                <p>No tickets found.</p>
                <p>Switch filters or create a new ticket.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <article
                  key={ticket._id}
                  onClick={() => setSelectedTicketId(ticket._id)}
                  className={`rounded-3xl border p-4 transition cursor-pointer ${
                    selectedTicketId === ticket._id
                      ? "border-gray-900 bg-gray-900/5"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {ticket.subject}
                    </p>
                    <span
                      className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${
                        STATUS_BADGES[ticket.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ticket.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.category?.toUpperCase()} • {formatDate(ticket.updatedAt)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${
                        PRIORITY_BADGES[ticket.priority] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {ticket.createdBy?.name || "User"}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="lg:flex-1 space-y-6">
          {selectedTicket ? (
            <>
              <article className="rounded-3xl border border-gray-100 p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-400 font-semibold">
                      Ticket #{selectedTicketId?.slice(-6)}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedTicket.subject}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {formatDate(selectedTicket.createdAt)} by{" "}
                      <span className="font-medium">
                        {selectedTicket.createdBy?.name || "User"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`text-xs font-semibold border px-3 py-1 rounded-full ${
                        STATUS_BADGES[selectedTicket.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedTicket.status.replace("-", " ")}
                    </span>
                    <span
                      className={`text-xs font-semibold border px-3 py-1 rounded-full ${
                        PRIORITY_BADGES[selectedTicket.priority] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedTicket.priority} priority
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedTicket.description}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Assigned to
                    </p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {selectedTicket.assignedTo?.name || (isAdmin ? "Unassigned" : "Support")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Last update
                    </p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {formatDate(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm text-gray-600 font-medium">
                      Update status
                      <select
                        value={selectedTicket.status}
                        onChange={(event) => handleStatusUpdate(event.target.value)}
                        disabled={updating}
                        className="ml-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={handleAssignToMe}
                      disabled={updating}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <FiUserCheck className="w-4 h-4" />
                      Assign to me
                    </button>
                  </div>
                )}
              </article>

              <article className="rounded-3xl border border-gray-100 p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FiMessageCircle className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-lg font-semibold text-gray-900">Conversation</h4>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedTicket.messages?.length ? (
                    selectedTicket.messages.map((msg, index) => (
                      <div
                        key={`${msg.createdAt}-${index}`}
                        className="rounded-2xl border border-gray-100 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            {msg.sender?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(msg.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No messages yet.</p>
                  )}
                </div>
                <div className="rounded-2xl border border-gray-100 p-3 bg-gray-50">
                  <textarea
                    rows={3}
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Type an update for this ticket"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-300 focus:outline-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      <FiSend className="w-4 h-4" />
                      Send update
                    </button>
                  </div>
                </div>
              </article>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center">
              <FiAlertCircle className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">
                Select a ticket to view its details.
              </p>
            </div>
          )}

          <article className="rounded-3xl border border-gray-100 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FiPhone className="w-5 h-5 text-emerald-500" />
              <h4 className="text-lg font-semibold text-gray-900">Need live help?</h4>
            </div>
            <p className="text-sm text-gray-600">
              Reach our support teams directly. These channels are monitored and respond
              quickly across timezones.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {contacts.map((contact) => (
                <div
                  key={contact.label}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-1"
                >
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    {contact.label}
                  </p>
                  {contact.email && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <FiMail className="w-3 h-3" />
                      {contact.email}
                    </p>
                  )}
                  {contact.phone && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <FiPhone className="w-3 h-3" />
                      {contact.phone}
                    </p>
                  )}
                  {contact.hours && (
                    <p className="text-xs text-gray-500">{contact.hours}</p>
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default HelpdeskCenter;

