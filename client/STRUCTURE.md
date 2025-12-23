# Client Folder Structure

## Overview

The client has been reorganized with a proper folder structure following React best practices.

## Directory Structure

```
client/
├── public/                 # Static public files
├── src/
│   ├── App.js             # Main app component with routes
│   ├── index.js           # Entry point
│   │
│   ├── config/            # Configuration files
│   │   ├── api.js         # API configuration
│   │   └── constants.js   # App constants
│   │
│   ├── components/        # Reusable UI components
│   │   ├── admin-dashboard/
│   │   ├── employee-dashboard/
│   │   ├── attendance/
│   │   ├── common/
│   │   ├── assistant/
│   │   ├── helpdesk/
│   │   ├── holidays/
│   │   ├── salary/
│   │   ├── timesheet/
│   │   └── SEO/
│   │
│   ├── pages/             # Page components (routes)
│   │   ├── admin/         # Admin pages
│   │   ├── employee/      # Employee pages
│   │   ├── landing/       # Landing pages
│   │   ├── features/      # Feature pages
│   │   └── static/        # Static pages
│   │
│   ├── layouts/           # Layout components
│   │   ├── admin/         # Admin layout
│   │   └── employee/     # Employee layout
│   │
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js
│   │   └── NotificationContext.js
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useCustomFields.js
│   │   └── useTheme.js
│   │
│   ├── services/          # API services
│   │   └── apiService.js  # Axios instance
│   │
│   ├── utils/             # Utility functions
│   │   ├── api.js         # API endpoints (legacy)
│   │   ├── sidebarAccess.js
│   │   └── sidebarMenu.js
│   │
│   ├── assets/            # Static assets
│   ├── styles/            # Global styles
│   └── docs/              # Documentation pages
│
└── package.json
```

## Key Changes

### 1. Configuration (`config/`)
- **api.js**: Centralized API base URL configuration
- **constants.js**: Application-wide constants (roles, routes, storage keys)

### 2. Services (`services/`)
- **apiService.js**: Axios instance with interceptors for authentication and error handling

### 3. Layouts (`layouts/`)
- Separated layout components from regular components
- Admin and employee layouts in dedicated folders

### 4. Updated Files
- **utils/api.js**: Now uses config for BASE_URL

## Migration Notes

### Import Paths

Some imports may need updating:

**Old:**
```javascript
import Layout from './components/admin-dashboard/layout/Layout';
```

**New (when layouts are moved):**
```javascript
import Layout from './layouts/admin/Layout';
```

### API Configuration

**Old:**
```javascript
const BASE_URL = 'http://localhost:5000';
```

**New:**
```javascript
import { API_CONFIG } from '../config/api';
const BASE_URL = API_CONFIG.BASE_URL;
```

## Next Steps

1. **Move Layout Files**: Copy layout components to `layouts/` folder
2. **Update Imports**: Update all imports in `App.js` and other files
3. **Migrate API Calls**: Gradually migrate from `utils/api.js` to service files
4. **Clean Duplicates**: Remove duplicate AuthContext and other duplicate files
5. **Organize Components**: Further organize components by feature

## Best Practices

1. **Components**: Keep reusable, presentational components in `components/`
2. **Pages**: Route-level components go in `pages/`
3. **Services**: API calls and business logic in `services/`
4. **Utils**: Pure utility functions in `utils/`
5. **Config**: Configuration and constants in `config/`

## Environment Variables

Create `.env` in `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

