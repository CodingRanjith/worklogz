# Demo Request Form Setup

## Overview
A complete demo request form has been implemented for Worklogz. When users submit a demo request, emails are sent to both the admin team and the requester.

## Email Configuration

### Required Environment Variables
Add these to your `.env` file in the `server/` directory:

```env
NOTIFY_EMAIL=technologyrk001@gmail.com
NOTIFY_PASSWORD=whoamihacker
```

### Gmail App Password Setup
If you're using Gmail with 2FA enabled, you'll need to:
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password for "Mail"
3. Use that app password instead of your regular password in `NOTIFY_PASSWORD`

## Features

### Frontend
- **Demo Request Form Component** (`client/src/components/DemoRequestForm.jsx`)
  - Modal form with smooth animations
  - Responsive design for mobile and desktop
  - Form validation
  - Success/error notifications using SweetAlert2
  - Accessible from the landing page header

### Backend
- **Demo Controller** (`server/controllers/demoController.js`)
  - Handles demo request submissions
  - Sends notification email to admin team
  - Sends confirmation email to requester
  - Beautiful HTML email templates

- **Demo Route** (`server/routes/demoRoutes.js`)
  - POST `/api/demo/request` - Submit a demo request

## API Endpoint

```
POST /api/demo/request
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-1234",
  "company": "Acme Corp" (optional),
  "message": "I'd like to see how Worklogz handles attendance tracking" (optional),
  "preferredDate": "2024-01-15" (optional),
  "preferredTime": "14:00" (optional)
}
```

## Usage

### From Landing Page Header
The "Request Demo" button is available in:
- Desktop header (top right)
- Mobile menu

### Programmatically
```jsx
import DemoRequestForm from '../components/DemoRequestForm';

function MyComponent() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowDemoForm(true)}>Request Demo</button>
      <DemoRequestForm 
        isOpen={showDemoForm} 
        onClose={() => setShowDemoForm(false)} 
      />
    </>
  );
}
```

## Email Recipients

When a demo request is submitted, emails are sent to:
- `techackode@gmail.com` (admin notification)

And a confirmation email is sent to the requester.

## Testing

1. Start your server: `cd server && npm run dev`
2. Start your client: `cd client && npm start`
3. Navigate to the landing page
4. Click "Request Demo" in the header
5. Fill out and submit the form
6. Check the email inboxes for notifications

## Notes

- The form includes validation for required fields (name, email, phone)
- Email validation ensures proper email format
- The date picker only allows future dates
- All fields except name, email, and phone are optional
- The form automatically closes after successful submission

