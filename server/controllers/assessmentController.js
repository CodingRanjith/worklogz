const Assessment = require('../models/Assessment');
const User = require('../models/User');

// Get all assessments (admin)
const getAllAssessments = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = { createdBy: req.user._id };
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const assessments = await Assessment.find(query)
      .populate('createdBy', 'name email')
      .populate('allowedUsers', 'name email employeeId')
      .sort({ createdAt: -1 });

    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
};

// Get assessment by ID
const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id)
      .populate('createdBy', 'name email')
      .populate('allowedUsers', 'name email employeeId')
      .populate('submissions.user', 'name email employeeId');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // If user is not admin and not in allowedUsers, check if they can view
    const isAdmin = req.user.role === 'admin';
    const isCreator = assessment.createdBy._id.toString() === req.user._id.toString();
    const isAllowed = assessment.allowedUsers.some(
      u => u._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isCreator && !isAllowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Failed to fetch assessment' });
  }
};

// Create new assessment
const createAssessment = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      questions,
      duration,
      passingScore,
      allowedUsers,
      allowedDepartments,
      startDate,
      endDate,
      security
    } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }

    const assessment = new Assessment({
      title,
      description,
      instructions,
      questions: questions || [],
      duration,
      passingScore: passingScore || 60,
      allowedUsers: allowedUsers || [],
      allowedDepartments: allowedDepartments || [],
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      security: {
        preventCopyPaste: security?.preventCopyPaste !== false,
        preventSkip: security?.preventSkip !== false,
        preventTabSwitch: security?.preventTabSwitch !== false,
        fullscreenMode: security?.fullscreenMode !== false,
        shuffleQuestions: security?.shuffleQuestions || false,
        shuffleOptions: security?.shuffleOptions || false,
        showResults: security?.showResults !== false,
        allowReview: security?.allowReview || false
      },
      createdBy: req.user._id,
      company: req.user.company || 'Default Company'
    });

    await assessment.save();
    await assessment.populate('createdBy', 'name email');
    await assessment.populate('allowedUsers', 'name email employeeId');

    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      instructions,
      questions,
      duration,
      passingScore,
      allowedUsers,
      allowedDepartments,
      isActive,
      startDate,
      endDate,
      security
    } = req.body;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user is creator or admin
    if (assessment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (title !== undefined) assessment.title = title;
    if (description !== undefined) assessment.description = description;
    if (instructions !== undefined) assessment.instructions = instructions;
    if (questions !== undefined) assessment.questions = questions;
    if (duration !== undefined) assessment.duration = duration;
    if (passingScore !== undefined) assessment.passingScore = passingScore;
    if (allowedUsers !== undefined) assessment.allowedUsers = allowedUsers;
    if (allowedDepartments !== undefined) assessment.allowedDepartments = allowedDepartments;
    if (isActive !== undefined) assessment.isActive = isActive;
    if (startDate !== undefined) assessment.startDate = startDate ? new Date(startDate) : new Date();
    if (endDate !== undefined) assessment.endDate = endDate ? new Date(endDate) : null;
    if (security !== undefined) {
      assessment.security = {
        ...assessment.security,
        ...security
      };
    }

    await assessment.save();
    await assessment.populate('createdBy', 'name email');
    await assessment.populate('allowedUsers', 'name email employeeId');

    res.json(assessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Failed to update assessment' });
  }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user is creator or admin
    if (assessment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Assessment.findByIdAndDelete(id);
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Failed to delete assessment' });
  }
};

// Get assessments available for logged in user (employee)
const getMyAssessments = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const assessments = await Assessment.find({
      isActive: true,
      $or: [
        { allowedUsers: userId },
        { allowedDepartments: user?.department || '' },
        { allowedUsers: { $size: 0 } }, // If no specific users, allow all
        { allowedDepartments: { $size: 0 } } // If no specific departments, allow all
      ],
      $and: [
        { startDate: { $lte: new Date() } },
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: new Date() } }
          ]
        }
      ]
    })
      .populate('createdBy', 'name email')
      .select('-questions.options.isCorrect -questions.correctAnswer') // Hide correct answers
      .sort({ createdAt: -1 });

    // Filter out assessments user has already completed
    const filteredAssessments = assessments.filter(assessment => {
      const userSubmission = assessment.submissions.find(
        sub => sub.user.toString() === userId.toString() && sub.status === 'completed'
      );
      return !userSubmission || assessment.security?.allowReview;
    });

    res.json(filteredAssessments);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
};

// Start assessment (create submission)
const startAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (!assessment.isActive) {
      return res.status(400).json({ message: 'Assessment is not active' });
    }

    // Check if user is allowed
    const userId = req.user._id;
    const user = await User.findById(userId);
    const isAllowed = assessment.allowedUsers.length === 0 ||
      assessment.allowedUsers.some(u => u.toString() === userId.toString()) ||
      assessment.allowedDepartments.includes(user?.department || '');

    if (!isAllowed) {
      return res.status(403).json({ message: 'You are not allowed to take this assessment' });
    }

    // Check if already submitted
    const existingSubmission = assessment.submissions.find(
      sub => sub.user.toString() === userId.toString() && sub.status === 'completed'
    );

    if (existingSubmission && !assessment.security?.allowReview) {
      return res.status(400).json({ message: 'You have already completed this assessment' });
    }

    // Check if in progress
    const inProgressSubmission = assessment.submissions.find(
      sub => sub.user.toString() === userId.toString() && sub.status === 'in-progress'
    );

    if (inProgressSubmission) {
      return res.status(400).json({ message: 'You have an assessment in progress' });
    }

    // Create new submission
    const submission = {
      user: userId,
      answers: [],
      startedAt: new Date(),
      status: 'in-progress'
    };

    assessment.submissions.push(submission);
    await assessment.save();

    // Return assessment without correct answers
    const assessmentForUser = assessment.toObject();
    assessmentForUser.questions = assessment.questions.map(q => {
      const question = { ...q };
      if (question.options) {
        question.options = question.options.map(opt => ({
          text: opt.text,
          _id: opt._id
        }));
      }
      delete question.correctAnswer;
      return question;
    });

    const userSubmission = assessmentForUser.submissions.find(
      sub => sub.user.toString() === userId.toString() && sub.status === 'in-progress'
    );

    res.json({
      assessment: assessmentForUser,
      submission: userSubmission
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ message: 'Failed to start assessment' });
  }
};

// Submit answer for a question
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, answer } = req.body;

    if (!questionId || answer === undefined) {
      return res.status(400).json({ message: 'Question ID and answer are required' });
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const userId = req.user._id;
    const submission = assessment.submissions.find(
      sub => sub.user.toString() === userId.toString() && sub.status === 'in-progress'
    );

    if (!submission) {
      return res.status(400).json({ message: 'No active assessment session found' });
    }

    const question = assessment.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if answer already exists
    const existingAnswerIndex = submission.answers.findIndex(
      a => a.questionId.toString() === questionId
    );

    let isCorrect = false;
    let pointsEarned = 0;

    // Evaluate answer
    if (question.questionType === 'multiple-choice' || question.questionType === 'single-choice') {
      if (question.options && Array.isArray(answer)) {
        const selectedOptions = question.options.filter((opt, idx) => answer.includes(idx));
        isCorrect = selectedOptions.every(opt => opt.isCorrect) &&
          selectedOptions.length === question.options.filter(opt => opt.isCorrect).length;
      } else if (typeof answer === 'number' || typeof answer === 'string') {
        const optIndex = typeof answer === 'string' ? parseInt(answer) : answer;
        isCorrect = question.options[optIndex]?.isCorrect || false;
      }
    } else if (question.questionType === 'text' || question.questionType === 'essay') {
      // For text/essay, compare with correctAnswer (case-insensitive for text)
      if (question.correctAnswer) {
        if (question.questionType === 'text') {
          isCorrect = question.correctAnswer.toLowerCase().trim() === String(answer).toLowerCase().trim();
        } else {
          // Essay requires manual grading, mark as pending
          isCorrect = false; // Will be graded manually
        }
      }
    }

    if (isCorrect) {
      pointsEarned = question.points || 1;
    }

    const answerData = {
      questionId,
      answer,
      isCorrect,
      pointsEarned
    };

    if (existingAnswerIndex >= 0) {
      submission.answers[existingAnswerIndex] = answerData;
    } else {
      submission.answers.push(answerData);
    }

    await assessment.save();

    res.json({ message: 'Answer submitted', answer: answerData });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to submit answer' });
  }
};

// Submit assessment (complete)
const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSpent, warnings, violations } = req.body;

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const userId = req.user._id;
    const submission = assessment.submissions.find(
      sub => sub.user.toString() === userId.toString() && sub.status === 'in-progress'
    );

    if (!submission) {
      return res.status(400).json({ message: 'No active assessment session found' });
    }

    // Calculate score
    const totalPoints = submission.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const maxPoints = assessment.totalPoints || 1;
    const percentage = Math.round((totalPoints / maxPoints) * 100);

    submission.submittedAt = new Date();
    submission.timeSpent = timeSpent || Math.round((new Date() - submission.startedAt) / 1000);
    submission.score = totalPoints;
    submission.totalPoints = maxPoints;
    submission.percentage = percentage;
    submission.status = 'completed';
    if (warnings) submission.warnings = warnings;
    if (violations) submission.violations = violations;

    await assessment.save();
    await assessment.populate('submissions.user', 'name email employeeId');

    const updatedSubmission = assessment.submissions.id(submission._id);

    res.json({
      message: 'Assessment submitted successfully',
      submission: updatedSubmission,
      passed: percentage >= assessment.passingScore
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Failed to submit assessment' });
  }
};

// Get submission details
const getSubmission = async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    const assessment = await Assessment.findById(id)
      .populate('submissions.user', 'name email employeeId');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const submission = assessment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check access
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const isCreator = assessment.createdBy.toString() === req.user._id.toString();
    const isOwner = submission.user._id.toString() === userId.toString();

    if (!isAdmin && !isCreator && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Failed to fetch submission' });
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getMyAssessments,
  startAssessment,
  submitAnswer,
  submitAssessment,
  getSubmission
};

