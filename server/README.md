# Worklogz Server

Express.js backend server for the Worklogz application.

## Project Structure

```
server/
├── app.js                 # Express application configuration
├── server.js              # Server startup and initialization
├── config/                # Configuration files
│   ├── database.js        # MongoDB connection
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── emailConfig.js     # Email configuration
│   └── officeLocation.js  # Office location settings
├── models/                # Mongoose models
├── controllers/           # Route controllers
├── routes/                # Express routes
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── role.js           # Role-based access control
│   ├── routePermission.js # Route permissions
│   └── upload.js         # File upload middleware
├── services/              # Business logic services
│   ├── adminService.js   # Admin setup service
│   └── taskService.js    # Task cleanup service
├── socket/                # Socket.io configuration
│   └── socket.js         # Socket.io setup and handlers
├── utils/                 # Utility functions
│   ├── logger.js         # Logging utility
│   ├── constants.js      # Application constants
│   └── responseHelper.js # API response helpers
├── validators/            # Input validation schemas
├── scripts/               # Utility scripts
├── uploads/               # File uploads directory
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Environment variables configured (see `.env.example`)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Setup (optional)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
ADMIN_NAME=Admin
ADMIN_PHONE=1234567890
ADMIN_COMPANY=Your Company
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

- Task API: See `docs/TASK_API_DOCUMENTATION.md`
- Attendance API: See `docs/attendanceApis.txt`

## Architecture

### Application Flow

1. **server.js** - Entry point that:
   - Connects to MongoDB
   - Initializes Socket.io
   - Sets up default admin user
   - Starts the HTTP server

2. **app.js** - Express application that:
   - Configures middleware (CORS, JSON parsing, etc.)
   - Registers all routes
   - Handles errors

3. **Routes** - Define API endpoints and delegate to controllers

4. **Controllers** - Handle request/response logic

5. **Services** - Contain business logic separate from controllers

6. **Models** - Mongoose schemas for database entities

### Socket.io

Real-time features are handled through Socket.io:
- User connections/disconnections
- Group messaging
- Typing indicators
- Real-time notifications

See `socket/socket.js` for implementation details.

## Development Guidelines

### Adding New Features

1. **Models**: Add Mongoose schemas in `models/`
2. **Controllers**: Add request handlers in `controllers/`
3. **Routes**: Define routes in `routes/` and mount in `app.js`
4. **Services**: Extract business logic to `services/` when needed
5. **Validators**: Add input validation in `validators/`

### Code Style

- Use async/await for asynchronous operations
- Handle errors appropriately
- Use consistent naming conventions
- Add comments for complex logic

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server

## License

ISC

