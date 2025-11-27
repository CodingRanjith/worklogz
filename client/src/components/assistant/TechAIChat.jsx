import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiLoader,
  FiSend,
  FiStar,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import { API_ENDPOINTS } from "../../utils/api";

const SUGGESTIONS = [
  "Summarize my current sprint priorities.",
  "Draft a UI copy for attendance reminder.",
  "How do I debug camera capture issues?",
  "Suggest a daily standup agenda.",
];

const TechAIChat = ({ variant = "panel", onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Techackode Copilot. Ask me anything about design, development, or Worklogz workflows.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = useMemo(() => {
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [token]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending]);

  const handleSend = async (prompt) => {
    const trimmed = (prompt ?? input).trim();
    if (!trimmed || !authHeaders || isSending) return;

    const userMessage = { role: "user", content: trimmed };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const { data } = await axios.post(
        API_ENDPOINTS.assistantChat,
        {
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        },
        authHeaders
      );

      const assistantContent = data?.message?.content || data?.message?.text;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            Array.isArray(assistantContent) && assistantContent.length
              ? assistantContent.map((chunk) => chunk.text || chunk).join("\n")
              : typeof assistantContent === "string"
              ? assistantContent
              : "I couldn't read OpenRouter's reply, please try again.",
        },
      ]);
    } catch (err) {
      console.error("TechAI chat error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Unable to reach Copilot right now.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching my models. Mind trying again?",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages((prev) => (prev.length ? [prev[0]] : []));
    setError("");
  };

  const containerClass =
    variant === "inline"
      ? "bg-white border rounded-3xl p-4 shadow-sm"
      : "bg-white border rounded-3xl p-4 sm:p-6 shadow-sm";

  if (!token) {
    return (
      <div className={containerClass}>
        <p className="text-center text-gray-600">
          Log in to chat with Techackode Copilot.
        </p>
      </div>
    );
  }

  return (
    <section className={containerClass}>
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
              title="Back"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
          <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold flex items-center gap-1">
            <FiStar className="w-4 h-4" />
              Techackode Copilot
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              AI agent for design & dev support
            </h2>
            <p className="text-xs text-gray-500">
              Ask about UI ideas, debugging steps, or company workflows.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            title="Clear chat"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div
        ref={scrollRef}
        className="mb-4 h-72 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-3"
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow ${
                message.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiLoader className="w-4 h-4 animate-spin" />
            Copilot is thinking...
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 mb-4">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSend(suggestion)}
            className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-600 hover:border-gray-300 transition"
          >
            <FiZap className="w-3 h-3 text-indigo-500" />
            <span>{suggestion}</span>
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask about Techackode design systems, deployment guides, or best practices..."
          className="flex-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-gray-300 focus:outline-none shadow-inner"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={isSending || !input.trim()}
          className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSending ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
        </button>
      </div>
    </section>
  );
};

export default TechAIChat;

