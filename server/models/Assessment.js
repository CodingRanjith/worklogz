const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'single-choice', 'text', 'essay'],
    default: 'multiple-choice'
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const AssessmentSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  warnings: [{
    type: String,
    timestamp: Date
  }],
  violations: [{
    type: String,
    timestamp: Date
  }]
}, { timestamps: true });

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  questions: [QuestionSchema],
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  passingScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  allowedDepartments: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  security: {
    preventCopyPaste: {
      type: Boolean,
      default: true
    },
    preventSkip: {
      type: Boolean,
      default: true
    },
    preventTabSwitch: {
      type: Boolean,
      default: true
    },
    fullscreenMode: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: false
    }
  },
  submissions: [AssessmentSubmissionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    default: 'Default Company'
  }
}, {
  timestamps: true
});

// Calculate total points before saving
AssessmentSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  }
  next();
});

// Index for better query performance
AssessmentSchema.index({ createdBy: 1, isActive: 1 });
AssessmentSchema.index({ allowedUsers: 1 });
AssessmentSchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model('Assessment', AssessmentSchema);


