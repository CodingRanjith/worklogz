# Task Management API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://worklogz.onrender.com`

## Authentication
All endpoints require Bearer token authentication in the header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Tasks (with filtering & pagination)
**GET** `/api/tasks`

**Query Parameters:**
- `startDate` (string): Filter tasks by start date (YYYY-MM-DD)
- `endDate` (string): Filter tasks by end date (YYYY-MM-DD)
- `status` (string): Filter by task status ('backlog', 'todo', 'doing', 'done', 'all')
- `assignee` (string): Filter by assignee name (partial match)
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 50, max: 100)
- `sortBy` (string): Field to sort by (default: 'createdAt')
- `sortOrder` (string): Sort order ('asc' or 'desc', default: 'desc')

**Response:**
```json
{
  "tasks": [
    {
      "_id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "status": "todo",
      "reporter": "John Doe",
      "assignee": "Jane Smith",
      "startTime": "2024-01-15",
      "endTime": "2024-01-16",
      "comments": [],
      "done": false,
      "createdAt": "2024-01-15T10:00:00Z",
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@email.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get Single Task
**GET** `/api/tasks/:id`

**Response:**
```json
{
  "_id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "status": "todo",
  "reporter": "John Doe",
  "assignee": "Jane Smith",
  "startTime": "2024-01-15",
  "endTime": "2024-01-16",
  "comments": [
    {
      "by": "John Doe",
      "at": "2024-01-15T11:00:00Z",
      "text": "Comment text"
    }
  ],
  "done": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@email.com"
  }
}
```

### 3. Create New Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "status": "backlog",
  "reporter": "John Doe (optional)",
  "assignee": "Jane Smith (optional)",
  "startTime": "2024-01-15 (optional, defaults to current date)",
  "endTime": "2024-01-16 (optional, defaults to startTime)",
  "comments": [],
  "done": false
}
```

**Response:**
```json
{
  "_id": "new_task_id",
  "title": "Task title",
  // ... other fields
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### 4. Update Task
**PUT** `/api/tasks/:id`

**Request Body:** (Any combination of fields to update)
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "doing",
  "assignee": "New Assignee",
  "startTime": "2024-01-16",
  "endTime": "2024-01-17",
  "done": false
}
```

**Response:**
```json
{
  "_id": "task_id",
  "title": "Updated task title",
  // ... updated fields
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### 5. Delete Task
**DELETE** `/api/tasks/:id`

**Response:**
```json
{
  "message": "Task deleted successfully",
  "deletedTask": {
    "id": "task_id",
    "title": "Deleted task title"
  }
}
```

### 6. Add Comment to Task
**POST** `/api/tasks/:id/comments`

**Request Body:**
```json
{
  "text": "This is a comment"
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "task": {
    // ... full task object with new comment
  },
  "newComment": {
    "by": "Current User Name",
    "at": "2024-01-15T12:00:00Z",
    "text": "This is a comment"
  }
}
```

### 7. Get Tasks by Date Range
**GET** `/api/tasks/date-range/:startDate/:endDate`

**URL Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "tasks": [
    // ... array of tasks within date range
  ],
  "tasksByDate": {
    "2024-01-15": [
      // ... tasks for this date
    ],
    "2024-01-16": [
      // ... tasks for this date
    ]
  },
  "dateRange": {
    "startDate": "2024-01-15",
    "endDate": "2024-01-16"
  },
  "totalTasks": 10
}
```

### 8. Get Task Statistics
**GET** `/api/tasks/stats/summary`

**Query Parameters:**
- `startDate` (optional): Start date for stats calculation
- `endDate` (optional): End date for stats calculation

**Response:**
```json
{
  "totalTasks": 25,
  "completedTasks": 10,
  "pendingTasks": 15,
  "todoTasks": 8,
  "doingTasks": 5,
  "backlogTasks": 2,
  "completionPercentage": 40
}
```

### 9. Bulk Update Tasks
**PATCH** `/api/tasks/bulk-update`

**Request Body:**
```json
{
  "taskIds": ["task_id_1", "task_id_2", "task_id_3"],
  "updateData": {
    "status": "done",
    "assignee": "New Assignee"
  }
}
```

**Response:**
```json
{
  "message": "Tasks updated successfully",
  "modifiedCount": 3,
  "matchedCount": 3
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "error": "Validation error message",
  "details": ["Specific validation errors"]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authorization token required"
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Server error message"
}
```

## Task Status Values
- `backlog`: Task is in backlog (not started)
- `todo`: Task is ready to be worked on
- `doing`: Task is currently in progress
- `done`: Task is completed

## Date Format
All dates should be provided in `YYYY-MM-DD` format (e.g., "2024-01-15")

## Frontend Integration Examples

### JavaScript/React Examples:

```javascript
// Get all tasks with filters
const tasks = await getAllTasksWithFilters({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  status: 'todo',
  page: 1,
  limit: 20
}, token);

// Create new task
const newTask = await createTask({
  title: 'New Task',
  description: 'Task description',
  startTime: '2024-01-15',
  endTime: '2024-01-16',
  assignee: 'John Doe'
}, token);

// Update task
const updatedTask = await updateTask('task_id', {
  status: 'doing',
  description: 'Updated description'
}, token);

// Add comment
const result = await addTaskComment('task_id', 'This is my comment', token);

// Get task statistics
const stats = await getTaskStats('2024-01-01', '2024-01-31', token);
```

## Notes
1. All tasks are user-specific (filtered by authenticated user)
2. Pagination is available for better performance with large datasets
3. Comments are stored as an array within each task
4. Tasks can span multiple dates (startTime to endTime)
5. Bulk operations are supported for efficiency
6. All endpoints include proper error handling and validation