import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiClock, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft,
  FiSave, FiAlertTriangle, FiTarget
} from 'react-icons/fi';
import './Assessments.css';

const Assessments = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startedAssessment, setStartedAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [violations, setViolations] = useState([]);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const intervalRef = useRef(null);
  const blurCountRef = useRef(0);
  const fullscreenRef = useRef(null);

  useEffect(() => {
    fetchAssessments();
    
    // Prevent context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent keyboard shortcuts
    const handleKeyDown = (e) => {
      if (startedAssessment && startedAssessment.assessment?.security?.preventCopyPaste) {
        // Disable Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X, Ctrl+S, F12, Ctrl+Shift+I, Ctrl+Shift+J
        if (
          (e.ctrlKey && ['c', 'v', 'a', 'x', 's', 'p'].includes(e.key.toLowerCase())) ||
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase()))
        ) {
          e.preventDefault();
          addViolation('Attempted to use restricted keyboard shortcut');
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Prevent copy/paste
    const handleCopy = (e) => {
      if (startedAssessment && startedAssessment.assessment?.security?.preventCopyPaste) {
        e.preventDefault();
        addViolation('Attempted to copy content');
      }
    };
    const handlePaste = (e) => {
      if (startedAssessment && startedAssessment.assessment?.security?.preventCopyPaste) {
        e.preventDefault();
        addViolation('Attempted to paste content');
      }
    };
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCopy);

    // Monitor tab/window visibility
    const handleVisibilityChange = () => {
      if (startedAssessment && document.hidden) {
        blurCountRef.current += 1;
        if (blurCountRef.current === 1) {
          addWarning('Tab switch detected');
        } else {
          addViolation('Multiple tab switches detected');
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor window blur
    const handleBlur = () => {
      if (startedAssessment && startedAssessment.assessment?.security?.preventTabSwitch) {
        blurCountRef.current += 1;
        if (blurCountRef.current === 1) {
          addWarning('Window focus lost');
        } else {
          addViolation('Multiple window focus losses detected');
        }
      }
    };
    window.addEventListener('blur', handleBlur);

    // Prevent leaving page
    const handleBeforeUnload = (e) => {
      if (startedAssessment) {
        e.preventDefault();
        e.returnValue = '';
        setShowExitWarning(true);
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Only exit fullscreen if we're still in fullscreen mode
      // Use a safe check to avoid calling during document inactive state
      if (startedAssessment && isFullscreen) {
        try {
          // Check if document is still accessible and in fullscreen
          if (typeof document !== 'undefined' && document && 
              (document.fullscreenElement || document.webkitFullscreenElement || 
               document.mozFullScreenElement || document.msFullscreenElement)) {
            exitFullscreen();
          } else {
            setIsFullscreen(false);
          }
        } catch (err) {
          // Silently handle errors during cleanup
          setIsFullscreen(false);
        }
      }
    };
  }, [startedAssessment, isFullscreen]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.getMyAssessments, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessments(res.data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessmentId) => {
    try {
      const res = await axios.post(API_ENDPOINTS.startAssessment(assessmentId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const assessmentData = res.data;
      setStartedAssessment(assessmentData);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeLeft(assessmentData.assessment.duration * 60); // Convert to seconds
      
      // Initialize answers from existing submission if any
      if (assessmentData.submission?.answers) {
        const initialAnswers = {};
        assessmentData.submission.answers.forEach(answer => {
          initialAnswers[answer.questionId] = answer.answer;
        });
        setAnswers(initialAnswers);
      }

      blurCountRef.current = 0;
      setWarnings([]);
      setViolations([]);

      // Start timer
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Enable fullscreen if required
      if (assessmentData.assessment.security?.fullscreenMode) {
        enterFullscreen();
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert(error.response?.data?.message || 'Failed to start assessment');
    }
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setIsFullscreen(true));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    // Safely exit fullscreen with comprehensive error handling
    // This function should never throw an error, even during component unmount
    
    setIsFullscreen(false); // Always update state first
    
    // Early return if document is not available
    if (typeof document === 'undefined' || !document) {
      return;
    }
    
    // Use requestAnimationFrame to ensure we're in a safe execution context
    // This helps avoid "Document not active" errors during unmount
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        try {
          exitFullscreenInternal();
        } catch (err) {
          // Silently ignore - component might be unmounting
        }
      });
    } else {
      // Fallback for environments without requestAnimationFrame
      try {
        exitFullscreenInternal();
      } catch (err) {
        // Silently ignore
      }
    }
    
    function exitFullscreenInternal() {
      if (typeof document === 'undefined' || !document) return;
      
      try {
        // Check if fullscreen is actually active
        const isFullscreenActive = 
          (document.fullscreenElement !== null) || 
          (document.webkitFullscreenElement !== null) || 
          (document.mozFullScreenElement !== null) || 
          (document.msFullscreenElement !== null);
        
        if (!isFullscreenActive) {
          return; // Already exited
        }
        
        // Attempt to exit fullscreen with proper error handling
        if (document.exitFullscreen && typeof document.exitFullscreen === 'function') {
          const promise = document.exitFullscreen();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
              // Silently ignore - document might not be active
            });
          }
        } else if (document.webkitExitFullscreen && typeof document.webkitExitFullscreen === 'function') {
          try {
            document.webkitExitFullscreen();
          } catch (e) {
            // Silently ignore
          }
        } else if (document.mozCancelFullScreen && typeof document.mozCancelFullScreen === 'function') {
          try {
            document.mozCancelFullScreen();
          } catch (e) {
            // Silently ignore
          }
        } else if (document.msExitFullscreen && typeof document.msExitFullscreen === 'function') {
          try {
            document.msExitFullscreen();
          } catch (e) {
            // Silently ignore
          }
        }
      } catch (err) {
        // Silently handle any errors - likely during component unmount
      }
    }
  };

  const addWarning = (message) => {
    setWarnings(prev => [...prev, { message, timestamp: new Date() }]);
  };

  const addViolation = (message) => {
    setViolations(prev => [...prev, { message, timestamp: new Date() }]);
  };

  const handleAnswerChange = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Auto-save answer
    try {
      await axios.post(
        API_ENDPOINTS.submitAnswer(startedAssessment.assessment._id),
        { questionId, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleNext = () => {
    const assessment = startedAssessment.assessment;
    if (assessment.security?.preventSkip) {
      const currentQuestion = assessment.questions[currentQuestionIndex];
      if (!answers[currentQuestion._id]) {
        alert('Please answer this question before proceeding');
        return;
      }
    }

    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit this assessment? You cannot change answers after submission.')) {
      return;
    }

    try {
      const timeSpent = startedAssessment.assessment.duration * 60 - timeLeft;
      await axios.post(
        API_ENDPOINTS.submitAssessment(startedAssessment.assessment._id),
        {
          timeSpent,
          warnings,
          violations
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      exitFullscreen();
      alert('Assessment submitted successfully!');
      setStartedAssessment(null);
      fetchAssessments();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment');
    }
  };

  const handleAutoSubmit = async () => {
    try {
      const timeSpent = startedAssessment.assessment.duration * 60;
      await axios.post(
        API_ENDPOINTS.submitAssessment(startedAssessment.assessment._id),
        {
          timeSpent,
          warnings,
          violations
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      exitFullscreen();
      alert('Time is up! Assessment has been auto-submitted.');
      setStartedAssessment(null);
      fetchAssessments();
    } catch (error) {
      console.error('Error auto-submitting assessment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Assessment taking view
  if (startedAssessment) {
    const assessment = startedAssessment.assessment;
    const currentQuestion = assessment.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = assessment.questions.length;

    return (
      <div className="assessment-taking-view">
        {/* Security Warning Banner */}
        {(warnings.length > 0 || violations.length > 0) && (
          <div className={`security-warning-banner ${violations.length > 0 ? 'red' : 'yellow'}`}>
            <div className="security-warning-content">
              <FiAlertTriangle className={`security-warning-icon ${violations.length > 0 ? 'red-icon' : 'yellow-icon'}`} />
              <div className="security-warning-text">
                <p className={`security-warning-title ${violations.length > 0 ? 'red-title' : 'yellow-title'}`}>
                  {violations.length > 0 ? 'Violations Detected' : 'Warnings'}
                </p>
                <p className={`security-warning-desc ${violations.length > 0 ? 'red-desc' : 'yellow-desc'}`}>
                  {violations.length > 0 
                    ? `${violations.length} violation(s) detected. This may affect your assessment.`
                    : `${warnings.length} warning(s). Please stay focused on the assessment.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="assessment-header-container">
          <div className="assessment-header">
            <div className="assessment-header-top">
              <div className="assessment-header-info">
                <h1>{assessment.title}</h1>
                <p>Question {currentQuestionIndex + 1} of {totalQuestions}</p>
              </div>
              <div className="assessment-header-actions">
                <div className={`timer-display ${timeLeft < 300 ? timeLeft < 60 ? 'danger' : 'warning' : ''}`}>
                  <FiClock />
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button onClick={handleSubmit} className="submit-assessment-btn">
                  <FiSave /> Submit Assessment
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <div className="progress-info">
                <span>{answeredCount} answered</span>
                <span>{totalQuestions - answeredCount} remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="question-nav-container">
          <div className="question-nav-wrapper">
            <div className="question-nav-grid">
              {assessment.questions.map((q, index) => (
                <button
                  key={q._id}
                  onClick={() => {
                    if (!assessment.security?.preventSkip || answers[q._id]) {
                      setCurrentQuestionIndex(index);
                    } else {
                      alert('Please answer this question before navigating');
                    }
                  }}
                  className={`question-nav-btn ${
                    index === currentQuestionIndex
                      ? 'active'
                      : answers[q._id]
                      ? 'answered'
                      : ''
                  }`}
                  disabled={assessment.security?.preventSkip && !answers[q._id] && index !== currentQuestionIndex}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="question-content-container">
          <div className="question-card-main">
            <div className="question-header-main">
              <h2 className="question-title-main">Question {currentQuestionIndex + 1}</h2>
              <span className="question-points-badge">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <p className="question-text">{currentQuestion.question}</p>

            <div className="options-container">
              {currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'single-choice' ? (
                currentQuestion.options?.map((option, index) => {
                  const isSelected = Array.isArray(answers[currentQuestion._id])
                    ? answers[currentQuestion._id].includes(index)
                    : answers[currentQuestion._id] === index;

                  return (
                    <label
                      key={index}
                      className={`option-item-main ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type={currentQuestion.questionType === 'single-choice' ? 'radio' : 'checkbox'}
                        name={`question-${currentQuestion._id}`}
                        checked={isSelected}
                        onChange={() => {
                          if (currentQuestion.questionType === 'single-choice') {
                            handleAnswerChange(currentQuestion._id, index);
                          } else {
                            const currentAnswers = Array.isArray(answers[currentQuestion._id])
                              ? answers[currentQuestion._id]
                              : answers[currentQuestion._id] !== undefined
                              ? [answers[currentQuestion._id]]
                              : [];
                            
                            if (currentAnswers.includes(index)) {
                              handleAnswerChange(currentQuestion._id, currentAnswers.filter(i => i !== index));
                            } else {
                              handleAnswerChange(currentQuestion._id, [...currentAnswers, index]);
                            }
                          }
                        }}
                        className={currentQuestion.questionType === 'single-choice' ? 'option-radio' : 'option-checkbox'}
                      />
                      <span className="option-text">{option.text}</span>
                    </label>
                  );
                })
              ) : (
                <textarea
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  className={`answer-textarea ${currentQuestion.questionType === 'essay' ? 'essay' : ''}`}
                  placeholder="Enter your answer here..."
                  onCopy={(e) => {
                    if (assessment.security?.preventCopyPaste) {
                      e.preventDefault();
                      addViolation('Attempted to copy answer');
                    }
                  }}
                  onPaste={(e) => {
                    if (assessment.security?.preventCopyPaste) {
                      e.preventDefault();
                      addViolation('Attempted to paste content');
                    }
                  }}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="question-nav-buttons">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="nav-btn prev"
              >
                <FiArrowLeft /> Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === assessment.questions.length - 1}
                className="nav-btn next"
              >
                Next <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Exit Warning Modal */}
        {showExitWarning && (
          <div className="exit-warning-modal">
            <div className="exit-warning-content">
              <FiAlertCircle className="exit-warning-icon" />
              <h3 className="exit-warning-title">Warning</h3>
              <p className="exit-warning-text">
                You are about to leave the assessment. Your progress may be lost. Are you sure you want to continue?
              </p>
              <div className="exit-warning-buttons">
                <button
                  onClick={() => {
                    setShowExitWarning(false);
                    handleSubmit();
                  }}
                  className="btn-submit"
                >
                  Submit & Exit
                </button>
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="btn-cancel"
                >
                  Stay on Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Assessment list view
  return (
    <div className="employee-assessments-page">
      <div className="employee-assessments-header">
        <div>
          <h1 className="employee-assessments-title">My Assessments</h1>
          <p className="employee-assessments-subtitle">Complete your assigned assessments</p>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="employee-empty-state">
          <FiCheckCircle className="employee-empty-icon" />
          <h3 className="employee-empty-title">No Assessments</h3>
          <p className="employee-empty-text">You don't have any assessments assigned at the moment.</p>
        </div>
      ) : (
        <div className="employee-assessments-grid">
          {assessments.map((assessment) => (
            <div key={assessment._id} className="employee-assessment-card">
              <div className="employee-card-header">
                <div className="employee-card-title-section">
                  <h3 className="employee-card-title">{assessment.title}</h3>
                  {assessment.security?.preventCopyPaste && (
                    <div className="employee-security-badge">
                      <FiLock /> Secure
                    </div>
                  )}
                </div>
              </div>

              {assessment.description && (
                <p className="employee-card-description">{assessment.description}</p>
              )}

              <div className="employee-card-stats">
                <div className="employee-card-stat">
                  <FiClock className="employee-stat-icon" />
                  <span>{assessment.duration} minutes</span>
                </div>
                <div className="employee-card-stat">
                  <FiCheckCircle className="employee-stat-icon" />
                  <span>{assessment.questions?.length || 0} questions</span>
                </div>
                <div className="employee-card-stat">
                  <FiTarget className="employee-stat-icon" />
                  <span>Pass: {assessment.passingScore}%</span>
                </div>
              </div>

              <button
                onClick={() => startAssessment(assessment._id)}
                className="employee-start-btn"
              >
                Start Assessment
                <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments;

