# Worklogz Client (Frontend)

React frontend application for the Worklogz platform.

## Project Structure

```
src/
├── App.js                 # Main application component with routes
├── index.js               # Application entry point
│
├── config/                 # Configuration files
│   ├── api.js             # API base URL and configuration
│   └── constants.js      # Application-wide constants
│
├── components/            # Reusable UI components
│   ├── admin-dashboard/   # Admin-specific components
│   ├── employee-dashboard/# Employee-specific components
│   ├── attendance/        # Attendance-related components
│   ├── common/            # Shared/common components
│   ├── assistant/        # AI assistant components
│   ├── helpdesk/          # Helpdesk components
│   ├── holidays/          # Holiday components
│   ├── salary/            # Salary-related components
│   ├── timesheet/         # Timesheet components
│   └── SEO/               # SEO components
│
├── pages/                 # Page components (route-level)
│   ├── admin/             # Admin pages
│   ├── employee/          # Employee pages
│   ├── landing/           # Landing page components
│   ├── features/         # Feature detail pages
│   └── static/            # Static marketing pages
│
├── layouts/               # Layout components
│   ├── admin/             # Admin layout components
│   └── employee/          # Employee layout components
│
├── context/               # React Context providers
│   ├── AuthContext.js     # Authentication context
│   └── NotificationContext.js # Notification context
│
├── hooks/                 # Custom React hooks
│   ├── useCustomFields.js
│   └── useTheme.js
│
├── services/              # API services and business logic
│   └── apiService.js      # Axios instance with interceptors
│
├── utils/                 # Utility functions
│   ├── api.js             # API endpoints (legacy - consider migrating)
│   ├── sidebarAccess.js   # Sidebar access utilities
│   └── sidebarMenu.js     # Sidebar menu utilities
│
├── assets/                # Static assets (images, fonts, etc.)
│   ├── dev/               # Development assets
│   └── ...                # Other assets
│
├── styles/                # Global styles
│   ├── auth.css
│   ├── design-system.css
│   └── ...                # Other global styles
│
└── docs/                  # Documentation pages
    ├── components/        # Documentation components
    ├── pages/             # Documentation pages
    └── styles/            # Documentation styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Running the Application

```bash
# Development
npm start

# Production build
npm run build
```

## Architecture

### Component Organization

- **Components**: Reusable UI components that can be used across pages
- **Pages**: Route-level components that represent full pages
- **Layouts**: Wrapper components that provide consistent structure (sidebars, navbars, etc.)

### State Management

- **Context API**: Used for global state (Auth, Notifications)
- **Local State**: Component-level state using React hooks

### API Communication

- **apiService.js**: Centralized axios instance with interceptors
- **utils/api.js**: API endpoint definitions (legacy)
- All API calls should use the apiService for consistent error handling

### Routing

Routes are defined in `App.js` using React Router:
- Public routes (landing, login, register)
- Protected employee routes (wrapped in EmployeeLayout)
- Protected admin routes (wrapped in AdminLayout)

## Development Guidelines

### Adding New Features

1. **New Page**: Add component in `pages/` and route in `App.js`
2. **New Component**: Add reusable component in `components/`
3. **New API Endpoint**: Add to `utils/api.js` (or migrate to services)
4. **New Layout**: Add to `layouts/` if needed

### Code Style

- Use functional components with hooks
- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names

### File Naming

- Components: PascalCase (e.g., `UserCard.jsx`)
- Utilities: camelCase (e.g., `apiService.js`)
- Styles: kebab-case (e.g., `user-card.css`)

## Migration Notes

### Recent Changes

- Created `config/` folder for configuration
- Created `services/` folder for API services
- Created `layouts/` folder for layout components
- Updated `utils/api.js` to use config

### Future Improvements

- Migrate API endpoints from `utils/api.js` to `services/`
- Consolidate duplicate AuthContext files
- Organize components by feature rather than by role
- Add TypeScript for better type safety

## License

ISC

