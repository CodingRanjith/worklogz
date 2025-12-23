# Configuration

This folder contains application configuration files.

## Files

- **api.js**: API base URL and configuration
- **constants.js**: Application-wide constants (roles, routes, storage keys, etc.)

## Usage

```javascript
import { API_CONFIG } from '../config/api';
import { ROLES, ROUTES } from '../config/constants';
```

## Environment Variables

Set `REACT_APP_API_URL` in `.env` to override the default API URL.

