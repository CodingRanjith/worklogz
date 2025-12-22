import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiX, FiSend, FiMic, FiMicOff, FiTrash2, FiVolume2, FiVolumeX } from 'react-icons/fi';
import worklogzAIGif from '../../assets/worklogz-ai.gif';
import { API_ENDPOINTS } from '../../utils/api';

const WorklogzChatbot = ({ currentUser, sidebarCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false);
  const [greetingSpoken, setGreetingSpoken] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const botButtonRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    if (isOpen && currentUser) {
      loadChatHistory();
    }
  }, [isOpen, currentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getWorklogzChatHistory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.messages && response.data.messages.length > 0) {
        setMessages(response.data.messages);
        setHasSpokenGreeting(true);
        // Check if greeting was already spoken
        const greetingSpokenKey = `worklogz_greeting_spoken_${currentUser?._id || 'default'}`;
        const wasGreetingSpoken = localStorage.getItem(greetingSpokenKey);
        if (wasGreetingSpoken) {
          setGreetingSpoken(true);
        }
      } else {
        // First time - speak greeting only if not spoken before
        const greetingSpokenKey = `worklogz_greeting_spoken_${currentUser?._id || 'default'}`;
        const wasGreetingSpoken = localStorage.getItem(greetingSpokenKey);
        if (!wasGreetingSpoken) {
          speakGreeting();
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Still speak greeting if history fails and not spoken before
      if (messages.length === 0) {
        const greetingSpokenKey = `worklogz_greeting_spoken_${currentUser?._id || 'default'}`;
        const wasGreetingSpoken = localStorage.getItem(greetingSpokenKey);
        if (!wasGreetingSpoken) {
          speakGreeting();
        }
      }
    }
  };

  const speakGreeting = () => {
    if (!currentUser || greetingSpoken) return;
    
    const greetingSpokenKey = `worklogz_greeting_spoken_${currentUser._id || 'default'}`;
    const wasGreetingSpoken = localStorage.getItem(greetingSpokenKey);
    
    if (wasGreetingSpoken) {
      setGreetingSpoken(true);
      return;
    }
    
    const userName = currentUser.name || 'User';
    const greeting = `Hello ${userName}, I am Worklogz AI. My boss is Ranjith Kumar. Worklogz was developed by Ranjith Kumar and Gayathri B. How can I help you?`;
    
    // Add greeting message
    const greetingMessage = {
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
    setHasSpokenGreeting(true);
    setGreetingSpoken(true);
    
    // Mark greeting as spoken in localStorage
    localStorage.setItem(greetingSpokenKey, 'true');

    // Speak the greeting only once (if not muted)
    if ('speechSynthesis' in window && !isVoiceMuted) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenChat = () => {
    setIsFlying(true);
    // Show big GIF first, then hide it, then show chat
    setTimeout(() => {
      setIsFlying(false);
      // Small delay before showing chat
      setTimeout(() => {
        setIsOpen(true);
        if (!hasSpokenGreeting && messages.length === 0) {
          setTimeout(() => {
            speakGreeting();
          }, 300);
        }
      }, 200);
    }, 1000); // Show big GIF for 1 second, then transition
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all chat history?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.clearWorklogzChatHistory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear messages from UI
      setMessages([]);
      setHasSpokenGreeting(false);
      
      // Clear greeting spoken flag from localStorage
      if (currentUser?._id) {
        const greetingSpokenKey = `worklogz_greeting_spoken_${currentUser._id}`;
        localStorage.removeItem(greetingSpokenKey);
        setGreetingSpoken(false);
      }
      
      // Speak greeting again
      setTimeout(() => {
        speakGreeting();
      }, 300);
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat history. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Sending message to:', API_ENDPOINTS.worklogzChat);
      console.log('Message:', inputMessage.trim());
      
      const response = await axios.post(
        API_ENDPOINTS.worklogzChat,
        { message: inputMessage.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('API Response:', response.data);

      // Handle different response structures
      let responseMessage = '';
      if (response.data.message) {
        responseMessage = response.data.message;
      } else if (response.data.content) {
        responseMessage = response.data.content;
      } else if (typeof response.data === 'string') {
        responseMessage = response.data;
      } else {
        responseMessage = JSON.stringify(response.data);
      }

      if (!responseMessage || responseMessage.trim() === '') {
        throw new Error('Empty response from API');
      }

      const assistantMessage = {
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response (user-friendly voice) - only if not muted
      if ('speechSynthesis' in window && !isVoiceMuted) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      // Extract error message from response
      if (error.response?.data?.msg) {
        errorContent = error.response.data.msg;
      } else if (error.response?.data?.message) {
        errorContent = error.response.data.message;
      } else if (error.message) {
        errorContent = `Error: ${error.message}`;
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (isOpen) {
    return (
      <>
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .chat-slide-in {
            animation: slideIn 0.3s ease-out;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in;
          }
        `}</style>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            ref={chatContainerRef}
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] max-h-[700px] flex flex-col chat-slide-in"
          >
            {/* Header - Attractive AI Style */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-purple-600 text-white p-5 rounded-t-lg flex items-center justify-between relative overflow-hidden shadow-lg">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-pulse"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse"></div>
                  <img 
                    src={worklogzAIGif} 
                    alt="Worklogz AI" 
                    className="w-16 h-16 rounded-full object-cover border-4 border-white/50 shadow-2xl relative z-10 transform transition-transform group-hover:scale-110"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg animate-pulse">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-2xl bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
                      Worklogz AI
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-white/95 flex items-center gap-2 mt-1 font-medium">
                    <span className="relative flex items-center">
                      <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-md animate-pulse"></span>
                      <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">AI Assistant</span>
                    <span className="text-white/80">•</span>
                    <span className="text-yellow-200 font-bold">Online</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={() => {
                    setIsVoiceMuted(!isVoiceMuted);
                    if (!isVoiceMuted) {
                      // Stop any ongoing speech when muting
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all hover:scale-110 group ${
                    isVoiceMuted 
                      ? 'bg-red-500/30 hover:bg-red-500/40' 
                      : 'hover:bg-white/30'
                  }`}
                  title={isVoiceMuted ? 'Unmute voice' : 'Mute voice'}
                >
                  {isVoiceMuted ? (
                    <FiVolumeX size={20} className="group-hover:text-red-200 transition-colors" />
                  ) : (
                    <FiVolume2 size={20} className="group-hover:text-green-200 transition-colors" />
                  )}
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-2.5 hover:bg-white/30 rounded-full transition-all hover:scale-110 group"
                  title="Clear chat history"
                >
                  <FiTrash2 size={20} className="group-hover:text-red-200 transition-colors" />
                </button>
                <button
                  onClick={handleCloseChat}
                  className="p-2.5 hover:bg-white/30 rounded-full transition-all hover:rotate-90 hover:scale-110 group"
                  title="Close chat"
                >
                  <FiX size={22} className="group-hover:text-red-200 transition-colors" />
                </button>
              </div>
            </div>

            {/* Messages - AI Style */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 chat-messages"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#a78bfa #f3f4f6'
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animation: 'fadeIn 0.3s ease-in' }}
                >
                  {msg.role === 'assistant' && (
                    <img 
                      src={worklogzAIGif} 
                      alt="AI" 
                      className="w-8 h-8 rounded-full mr-2 object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
                    }`}
                  >
                    <p className={`text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {msg.content}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 ml-2 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - AI Style */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 hover:from-purple-200 hover:to-blue-200'
                  }`}
                  title="Voice input"
                >
                  {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes flyToCenter {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          30% {
            transform: translate(calc(50vw - 50%), calc(50vh - 50%)) scale(3);
            opacity: 1;
          }
          60% {
            transform: translate(calc(50vw - 50%), calc(50vh - 50%)) scale(3);
            opacity: 1;
          }
          100% {
            transform: translate(calc(50vw - 50%), calc(50vh - 50%)) scale(0);
            opacity: 0;
          }
        }
        .flying-bot {
          animation: flyToCenter 1s ease-in-out forwards;
          z-index: 60;
        }
      `}</style>
      <div
        className={`fixed bottom-6 transition-all duration-300 z-40 ${
          sidebarCollapsed 
            ? 'right-4 md:right-4' 
            : 'right-4 md:right-6'
        }`}
      >
        <div className="relative">
          <div
            ref={botButtonRef}
            className={isFlying ? 'flying-bot' : ''}
          >
            <img
              src={worklogzAIGif}
              alt="Worklogz AI"
              className="w-32 h-32 md:w-40 md:h-40 animate-bounce cursor-pointer hover:scale-110 transition-transform"
              onClick={handleOpenChat}
              style={{
                animation: isFlying ? 'none' : 'bounce 2s infinite'
              }}
            />
            {!isFlying && (
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorklogzChatbot;
