import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiLoader,
  FiSend,
  FiBook,
  FiTrash2,
  FiZap,
  FiTarget,
} from "react-icons/fi";
import { API_ENDPOINTS } from "../../utils/api";

const SKILL_SUGGESTIONS = [
  "How can I improve my communication skills?",
  "What are the best practices for React development?",
  "Help me create a learning plan for Python programming",
  "How do I prepare for a technical interview?",
  "What skills should I develop for career growth?",
  "Explain async/await in JavaScript",
];

const SkillDevelopmentChat = ({ variant = "panel", onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Skill Development AI Assistant. I'm here to help you learn, grow, and develop your professional skills. Ask me about:\n\n• Technical skills (programming, tools, frameworks)\n• Soft skills (communication, leadership, teamwork)\n• Career development and growth strategies\n• Learning paths and resources\n• Interview preparation\n• Problem-solving and best practices\n\nWhat would you like to learn today?",
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
        API_ENDPOINTS.skillDevelopmentChat,
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
              : "I couldn't process the response, please try again.",
        },
      ]);
    } catch (err) {
      console.error("Skill Development chat error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Unable to reach AI assistant right now.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
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
          Log in to chat with Skill Development AI Assistant.
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
            <p className="text-xs uppercase tracking-wide text-green-600 font-semibold flex items-center gap-1">
              <FiBook className="w-4 h-4" />
              Skill Development AI
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              Your Personal Learning Assistant
            </h2>
            <p className="text-xs text-gray-500">
              Get guidance on technical skills, soft skills, and career growth.
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
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiLoader className="w-4 h-4 animate-spin" />
            AI Assistant is thinking...
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 mb-4">
        {SKILL_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSend(suggestion)}
            className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-600 hover:border-green-300 hover:bg-green-50 transition"
          >
            <FiTarget className="w-3 h-3 text-green-500" />
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
          placeholder="Ask about skills, learning paths, career advice, or technical concepts..."
          className="flex-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-gray-300 focus:outline-none shadow-inner"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={isSending || !input.trim()}
          className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-500 disabled:opacity-50"
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

export default SkillDevelopmentChat;

