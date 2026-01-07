const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkLogz API',
      version: '1.0.0',
      description: 'Complete API documentation for WorkLogz - Worklogs and related collections management system',
      contact: {
        name: 'WorkLogz API Support',
        email: 'support@worklogz.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://worklogz.onrender.com',
        description: 'Production server',
      },
      {
        url: 'https://worklogz.com',
        description: 'Production server (alternative)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', required: true, example: 'John Doe' },
            email: { type: 'string', format: 'email', required: true, example: 'john@example.com' },
            phone: { type: 'string', required: true, example: '+1234567890' },
            position: { type: 'string', required: true, example: 'Software Engineer' },
            company: { type: 'string', required: true, example: 'Techackode' },
            employeeId: { type: 'string', example: 'EMP001' },
            salary: { type: 'number', default: 0, example: 50000 },
            dailyEarnings: { type: 'number', default: 0, example: 200 },
            role: { type: 'string', enum: ['employee', 'admin', 'master-admin'], default: 'employee' },
            adminAccess: { type: 'boolean', default: false },
            profilePic: { type: 'string', format: 'uri' },
            isActive: { type: 'boolean', default: true },
            department: { type: 'string', example: 'IT' },
            qualification: { type: 'string', example: 'B.Tech' },
            dateOfJoining: { type: 'string', format: 'date' },
            rolesAndResponsibility: { type: 'array', items: { type: 'string' } },
            skills: { type: 'array', items: { type: 'string' } },
            bankDetails: { $ref: '#/components/schemas/BankDetails' },
            sidebarAccess: { $ref: '#/components/schemas/SidebarAccess' },
            isDeleted: { type: 'boolean', default: false },
            deletedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BankDetails: {
          type: 'object',
          properties: {
            accountNumber: { type: 'string' },
            ifscCode: { type: 'string' },
            bankName: { type: 'string' },
            branchName: { type: 'string' },
            accountHolderName: { type: 'string' },
          },
        },
        SidebarAccess: {
          type: 'object',
          properties: {
            admin: { type: 'array', items: { type: 'string' } },
            employee: { type: 'array', items: { type: 'string' } },
          },
        },
        UserCreate: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'position', 'company'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            phone: { type: 'string', example: '+1234567890' },
            position: { type: 'string', example: 'Software Engineer' },
            company: { type: 'string', example: 'Techackode' },
            role: { type: 'string', enum: ['employee', 'admin'], default: 'employee' },
            department: { type: 'string', example: 'IT' },
            profilePic: { type: 'string', format: 'binary', description: 'Profile picture file' },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            position: { type: 'string' },
            company: { type: 'string' },
            department: { type: 'string' },
            qualification: { type: 'string' },
            dateOfJoining: { type: 'string', format: 'date' },
            rolesAndResponsibility: { type: 'array', items: { type: 'string' } },
            skills: { type: 'array', items: { type: 'string' } },
            profilePic: { type: 'string', format: 'binary' },
          },
        },
        // Attendance Schema
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID reference' },
            type: { type: 'string', enum: ['check-in', 'check-out'], example: 'check-in' },
            location: { type: 'string', example: 'Office Building A' },
            isInOffice: { type: 'boolean', default: true },
            officeName: { type: 'string', example: 'Main Office' },
            image: { type: 'string', format: 'uri' },
            timestamp: { type: 'string', format: 'date-time' },
            adminBreakTimeMinutes: { type: 'number', default: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AttendanceCreate: {
          type: 'object',
          required: ['type'],
          properties: {
            type: { type: 'string', enum: ['check-in', 'check-out'], example: 'check-in' },
            location: { type: 'string', example: 'Office Building A' },
            isInOffice: { type: 'boolean', default: true },
            officeName: { type: 'string', example: 'Main Office' },
            image: { type: 'string', format: 'binary', description: 'Attendance image' },
          },
        },
        // Leave Request Schema
        LeaveRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID reference' },
            fromDate: { type: 'string', format: 'date', required: true },
            toDate: { type: 'string', format: 'date', required: true },
            reason: { type: 'string', required: true, example: 'Personal work' },
            leaveType: {
              type: 'string',
              enum: ['Casual Leave', 'Sick Leave', 'Privileged Leave', 'Compensation Off', 'Emergency'],
              default: 'Casual Leave',
            },
            isHalfDay: { type: 'boolean', default: false },
            halfDayPeriod: { type: 'string', enum: ['First Half', 'Second Half', null] },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
            numberOfDays: { type: 'number', default: 0 },
            isLOP: { type: 'boolean', default: false },
            adminNotes: { type: 'string' },
            year: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LeaveRequestCreate: {
          type: 'object',
          required: ['fromDate', 'toDate', 'reason'],
          properties: {
            fromDate: { type: 'string', format: 'date', example: '2024-01-15' },
            toDate: { type: 'string', format: 'date', example: '2024-01-17' },
            reason: { type: 'string', example: 'Personal work' },
            leaveType: {
              type: 'string',
              enum: ['Casual Leave', 'Sick Leave', 'Privileged Leave', 'Compensation Off', 'Emergency'],
              default: 'Casual Leave',
            },
            isHalfDay: { type: 'boolean', default: false },
            halfDayPeriod: { type: 'string', enum: ['First Half', 'Second Half'] },
          },
        },
        LeaveStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['Approved', 'Rejected'], example: 'Approved' },
            adminNotes: { type: 'string', example: 'Approved by HR' },
          },
        },
        // Task Schema
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', required: true, example: 'Complete project documentation' },
            description: { type: 'string', example: 'Write comprehensive documentation for the project' },
            dueDate: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['backlog', 'todo', 'in-progress', 'done'],
              default: 'backlog',
            },
            user: { type: 'string', description: 'User ID reference', required: true },
            reporter: { type: 'string', default: 'Unknown' },
            assignee: { type: 'string', default: 'Unassigned' },
            department: {
              type: 'string',
              enum: [
                'Administration',
                'Human Resources (HR)',
                'Finance & Accounting',
                'Sales',
                'Marketing',
                'Customer Support / Service',
                'Operations / Project Management',
                'Legal & Compliance',
                'Procurement / Purchasing',
                'Research & Development (R&D)',
                'Information Technology (IT)',
                'Quality Assurance (QA)',
                'Business Development',
                'Public Relations (PR)',
                'Training & Development',
                'Development',
                'Testing',
                'Accounts',
                'Designing',
                'Resources',
                'Learning',
              ],
            },
            startTime: { type: 'string', format: 'time', example: '09:00' },
            endTime: { type: 'string', format: 'time', example: '17:00' },
            comments: { type: 'array', items: { type: 'object' } },
            done: { type: 'boolean', default: false },
            isDeleted: { type: 'boolean', default: false },
            deletedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TaskCreate: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Complete project documentation' },
            description: { type: 'string', example: 'Write comprehensive documentation' },
            dueDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['backlog', 'todo', 'in-progress', 'done'] },
            assignee: { type: 'string', example: 'John Doe' },
            department: { type: 'string' },
            startTime: { type: 'string', format: 'time', example: '09:00' },
            endTime: { type: 'string', format: 'time', example: '17:00' },
          },
        },
        TaskUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['backlog', 'todo', 'in-progress', 'done'] },
            assignee: { type: 'string' },
            department: { type: 'string' },
            startTime: { type: 'string', format: 'time' },
            endTime: { type: 'string', format: 'time' },
            done: { type: 'boolean' },
          },
        },
        TaskComment: {
          type: 'object',
          required: ['comment'],
          properties: {
            comment: { type: 'string', example: 'This task is progressing well' },
          },
        },
        // Project Schema
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', required: true, example: 'E-commerce Platform' },
            code: { type: 'string', uppercase: true, example: 'ECOMM' },
            client: { type: 'string', example: 'ABC Corp' },
            description: { type: 'string', example: 'Full-stack e-commerce solution' },
            status: {
              type: 'string',
              enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
              default: 'planning',
            },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
            health: { type: 'string', enum: ['on-track', 'at-risk', 'off-track'], default: 'on-track' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            tags: { type: 'array', items: { type: 'string' } },
            createdBy: { type: 'string', description: 'User ID reference' },
            projectManager: { type: 'string', description: 'User ID reference' },
            teamMembers: { type: 'array', items: { $ref: '#/components/schemas/TeamMember' } },
            milestones: { type: 'array', items: { $ref: '#/components/schemas/Milestone' } },
            workspace: { $ref: '#/components/schemas/ProjectWorkspace' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TeamMember: {
          type: 'object',
          properties: {
            user: { type: 'string', description: 'User ID reference', required: true },
            role: { type: 'string', default: 'Contributor', example: 'Developer' },
            allocation: { type: 'number', min: 0, max: 100, default: 100, example: 80 },
            responsibility: { type: 'string', example: 'Frontend development' },
            assignedAt: { type: 'string', format: 'date-time' },
          },
        },
        Milestone: {
          type: 'object',
          properties: {
            title: { type: 'string', required: true, example: 'Phase 1 Completion' },
            dueDate: { type: 'string', format: 'date' },
            completed: { type: 'boolean', default: false },
          },
        },
        ProjectWorkspace: {
          type: 'object',
          properties: {
            quickLinks: { type: 'array', items: { $ref: '#/components/schemas/QuickLink' } },
            notes: { type: 'string' },
          },
        },
        QuickLink: {
          type: 'object',
          properties: {
            label: { type: 'string', example: 'Design Files' },
            url: { type: 'string', format: 'uri', example: 'https://figma.com/...' },
          },
        },
        ProjectCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'E-commerce Platform' },
            code: { type: 'string', example: 'ECOMM' },
            client: { type: 'string', example: 'ABC Corp' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['planning', 'active', 'on-hold', 'completed', 'archived'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
        ProjectMemberAssign: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            role: { type: 'string', example: 'Developer' },
            allocation: { type: 'number', min: 0, max: 100, example: 80 },
            responsibility: { type: 'string', example: 'Frontend development' },
          },
        },
        // Trainer Schema
        Trainer: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', required: true, example: 'Jane Smith' },
            email: { type: 'string', format: 'email', required: true, example: 'jane@example.com' },
            phone: { type: 'string', required: true, example: '+1234567890' },
            alternativePhone: { type: 'string' },
            courses: { type: 'array', items: { $ref: '#/components/schemas/TrainerCourse' } },
            companyLeadSharePercentage: { type: 'number', min: 0, max: 100, default: 0 },
            trainerLeadSharePercentage: { type: 'number', min: 0, max: 100, default: 0 },
            availableTimings: { type: 'array', items: { $ref: '#/components/schemas/DaySchedule' } },
            isActive: { type: 'boolean', default: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TrainerCourse: {
          type: 'object',
          properties: {
            name: { type: 'string', required: true, example: 'Full Stack Development' },
            amount: { type: 'number', min: 0, default: 0, example: 50000 },
            leadSource: { type: 'string', enum: ['trainer', 'company'], default: 'company' },
          },
        },
        DaySchedule: {
          type: 'object',
          properties: {
            day: {
              type: 'string',
              enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            isAvailable: { type: 'boolean', default: false },
            timeSlots: { type: 'array', items: { $ref: '#/components/schemas/TimeSlot' } },
          },
        },
        TimeSlot: {
          type: 'object',
          properties: {
            startTime: { type: 'string', format: 'time', example: '09:00' },
            endTime: { type: 'string', format: 'time', example: '17:00' },
          },
        },
        TrainerCreate: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            alternativePhone: { type: 'string' },
            courses: { type: 'array', items: { $ref: '#/components/schemas/TrainerCourse' } },
            companyLeadSharePercentage: { type: 'number', min: 0, max: 100 },
            trainerLeadSharePercentage: { type: 'number', min: 0, max: 100 },
            availableTimings: { type: 'array', items: { $ref: '#/components/schemas/DaySchedule' } },
          },
        },
        // Helpdesk Ticket Schema
        HelpdeskTicket: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            subject: { type: 'string', required: true, example: 'Login issue' },
            description: { type: 'string', required: true, example: 'Unable to login to the system' },
            category: { type: 'string', example: 'Technical' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
            status: { type: 'string', enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
            createdBy: { type: 'string', description: 'User ID reference' },
            assignedTo: { type: 'string', description: 'User ID reference' },
            watchers: { type: 'array', items: { type: 'string' }, description: 'Array of User IDs' },
            messages: { type: 'array', items: { $ref: '#/components/schemas/TicketMessage' } },
            lastResponseAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TicketMessage: {
          type: 'object',
          properties: {
            sender: { type: 'string', description: 'User ID reference' },
            message: { type: 'string', example: 'I can help you with this issue' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HelpdeskTicketCreate: {
          type: 'object',
          required: ['subject', 'description'],
          properties: {
            subject: { type: 'string', example: 'Login issue' },
            description: { type: 'string', example: 'Unable to login to the system' },
            category: { type: 'string', example: 'Technical' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            message: { type: 'string', example: 'Initial message' },
          },
        },
        TicketStatusUpdate: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['open', 'in-progress', 'resolved', 'closed'] },
            assignedTo: { type: 'string', description: 'User ID reference' },
          },
        },
        TicketMessageCreate: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string', example: 'This is a reply message' },
          },
        },
        HelpdeskSummary: {
          type: 'object',
          properties: {
            open: { type: 'number', example: 5 },
            inProgress: { type: 'number', example: 3 },
            resolved: { type: 'number', example: 12 },
            mine: { type: 'number', example: 8 },
          },
        },
        // Achievement Schema
        Achievement: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID reference' },
            type: { type: 'string', example: 'milestone' },
            title: { type: 'string', example: '100 Tasks Completed' },
            description: { type: 'string', example: 'Completed 100 tasks successfully' },
            points: { type: 'number', example: 100 },
            icon: { type: 'string', example: 'trophy' },
            earnedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AchievementAward: {
          type: 'object',
          required: ['userId', 'title'],
          properties: {
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            type: { type: 'string', example: 'milestone' },
            title: { type: 'string', example: '100 Tasks Completed' },
            description: { type: 'string' },
            points: { type: 'number', example: 100 },
            icon: { type: 'string', example: 'trophy' },
          },
        },
        // Auth Schema
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'position', 'company'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            phone: { type: 'string', example: '+1234567890' },
            position: { type: 'string', example: 'Software Engineer' },
            company: { type: 'string', example: 'Techackode' },
            profilePic: { type: 'string', format: 'binary', description: 'Profile picture file' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        // Error Schema
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            details: { type: 'string', example: 'Detailed error information' },
            stack: { type: 'string', description: 'Stack trace (development only)' },
          },
        },
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        // Pagination
        PaginationQuery: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1, example: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, example: 10 },
            sortBy: { type: 'string', example: 'createdAt' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc', example: 'desc' },
          },
        },
        // Assistant Chat Schema
        AssistantChatRequest: {
          type: 'object',
          required: ['messages'],
          properties: {
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['user', 'assistant'], example: 'user' },
                  content: { type: 'string', example: 'How do I mark attendance?' },
                },
              },
            },
          },
        },
        AssistantChatResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'assistant' },
                content: { type: 'string', example: 'To mark attendance...' },
              },
            },
            usage: { type: 'object' },
            model: { type: 'string', example: 'claude-3.5-sonnet' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
