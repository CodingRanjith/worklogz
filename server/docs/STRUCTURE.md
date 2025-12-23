# Server Structure Documentation

## Overview

The server follows a modular, scalable architecture with clear separation of concerns.

## Directory Structure

```
server/
│
├── app.js                    # Express app configuration and middleware setup
├── server.js                 # Server entry point - starts HTTP server and initializes services
├── package.json              # Dependencies and scripts
├── README.md                 # Main documentation
│
├── config/                   # Configuration files
│   ├── database.js          # MongoDB connection logic
│   ├── cloudinary.js        # Cloudinary image upload config
│   ├── emailConfig.js       # Email service configuration
│   └── officeLocation.js    # Office location settings
│
├── models/                   # Mongoose schemas (Database models)
│   ├── User.js
│   ├── Task.js
│   ├── Attendance.js
│   └── ... (other models)
│
├── controllers/              # Request handlers (Route controllers)
│   ├── authController.js
│   ├── userController.js
│   ├── timeSheetController.js
│   └── ... (other controllers)
│
├── routes/                   # Express route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── timeRoutes.js
│   └── ... (other routes)
│
├── middleware/              # Custom Express middleware
│   ├── auth.js             # JWT authentication
│   ├── role.js             # Role-based access control
│   ├── routePermission.js  # Route permissions
│   └── upload.js           # File upload handling
│
├── services/                # Business logic services
│   ├── adminService.js     # Admin user setup
│   └── taskService.js      # Task cleanup scheduling
│
├── socket/                  # Socket.io real-time features
│   └── socket.js           # Socket.io setup and event handlers
│
├── utils/                   # Utility functions
│   ├── logger.js           # Logging utility
│   ├── constants.js        # Application constants
│   └── responseHelper.js   # API response helpers
│
├── validators/              # Input validation schemas
│   └── (validation files)
│
├── scripts/                  # Utility scripts
│   ├── updateUsers.js      # User data migration script
│   ├── dailyCreditCron.js  # Cron job for daily credits
│   └── ... (other scripts)
│
├── uploads/                 # File upload directory
│   └── company/
│
└── docs/                    # Documentation
    ├── STRUCTURE.md        # This file
    ├── MIGRATION_NOTES.md  # Migration guide
    ├── TASK_API_DOCUMENTATION.md
    └── ... (other docs)
```

## File Responsibilities

### Entry Points

- **server.js**: 
  - Connects to MongoDB
  - Initializes Socket.io
  - Sets up default admin
  - Starts HTTP server
  - Handles graceful shutdown

- **app.js**: 
  - Configures Express middleware
  - Registers all routes
  - Error handling
  - Static file serving

### Configuration

- **config/database.js**: Database connection and disconnection logic
- **config/cloudinary.js**: Cloudinary SDK configuration
- **config/emailConfig.js**: Nodemailer configuration
- **config/officeLocation.js**: Office location coordinates

### Services

Services contain reusable business logic that can be shared across controllers:

- **adminService.js**: Admin user creation and management
- **taskService.js**: Task cleanup and scheduling logic

### Utilities

- **logger.js**: Centralized logging (can be extended with Winston)
- **constants.js**: Application-wide constants (roles, HTTP status codes, etc.)
- **responseHelper.js**: Standardized API response formatting

### Socket.io

- **socket/socket.js**: 
  - Socket.io server initialization
  - Authentication middleware
  - Connection/disconnection handling
  - Real-time event handlers (typing, groups, etc.)

## Request Flow

1. **Request** → `server.js` (HTTP server)
2. **Middleware** → `app.js` (CORS, JSON parsing, etc.)
3. **Route** → `routes/*.js` (matches endpoint)
4. **Controller** → `controllers/*.js` (handles logic)
5. **Service** → `services/*.js` (business logic, optional)
6. **Model** → `models/*.js` (database operations)
7. **Response** → Back through the chain

## Adding New Features

### Adding a New API Endpoint

1. **Model** (if new entity): Create in `models/`
2. **Controller**: Add handler in `controllers/`
3. **Route**: Define route in `routes/` and mount in `app.js`
4. **Service** (if complex logic): Extract to `services/`

### Adding a New Service

1. Create file in `services/`
2. Export functions
3. Import and use in controllers or other services

### Adding Validation

1. Create validator file in `validators/`
2. Use in route definitions before controller

## Best Practices

1. **Separation of Concerns**: Keep controllers thin, move logic to services
2. **Error Handling**: Use try-catch and proper error responses
3. **Async/Await**: Prefer over callbacks
4. **Environment Variables**: Use `.env` for configuration
5. **Logging**: Use logger utility for consistent logging
6. **Constants**: Define magic strings/numbers in `utils/constants.js`

## Environment Variables

Required environment variables (see `.env.example`):

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

Optional:
- Cloudinary credentials
- Admin user setup variables

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## Testing

The server is ready for testing. All existing endpoints should work as before.

