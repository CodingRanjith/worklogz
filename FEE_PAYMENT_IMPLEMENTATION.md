# Fee Payment System Implementation Guide

## Overview
This document outlines the implementation of the Techackode Edutech Fee Collection system. The frontend has been completed, and this guide provides details for backend implementation.

## Frontend Implementation Status ✅

### Employee Side
- **Page**: `/employee/fee-payment`
- **File**: `client/src/pages/employee/FeePayment.jsx`
- **Features**:
  - Multi-step form (Details → Payment → Upload → Success)
  - Form validation (name, email, phone, fee amount)
  - GPay UPI ID display with copy functionality
  - Payment screenshot upload
  - Success message with payment summary
  - Image preview before submission

### Admin Side
- **Page**: `/fee-payments`
- **File**: `client/src/pages/admin/FeePaymentsManagement.jsx`
- **Features**:
  - View all payment submissions
  - Search and filter by status (pending, verified, rejected)
  - Statistics dashboard (total, pending, verified, rejected)
  - Payment details modal with screenshot view
  - Update payment status (verify/reject)
  - Download screenshot functionality

### Routes Added
- Employee: `/employee/fee-payment` (in EmployeeSidebar)
- Admin: `/fee-payments` (in Admin Sidebar)

### API Endpoints (Frontend)
Added to `client/src/utils/api.js`:
- `submitFeePayment`: `${BASE_URL}/api/fee-payments/submit`
- `getAllFeePayments`: `${BASE_URL}/api/fee-payments`
- `getFeePaymentById`: `${BASE_URL}/api/fee-payments/${id}`
- `updateFeePaymentStatus`: `${BASE_URL}/api/fee-payments/${id}/status`

## Backend Implementation Required

### 1. Database Model
Create `server/models/FeePayment.js`:

```javascript
const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  feeAmount: {
    type: Number,
    required: true,
    min: 0
  },
  screenshot: {
    type: String, // Cloudinary URL
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);
```

### 2. Controller
Create `server/controllers/feePaymentController.js`:

```javascript
const FeePayment = require('../models/FeePayment');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure multer for Cloudinary uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fee_payments',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// Submit fee payment (Employee)
exports.submitFeePayment = async (req, res) => {
  try {
    const { name, email, phone, feeAmount } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Payment screenshot is required'
      });
    }

    const payment = new FeePayment({
      name,
      email,
      phone,
      feeAmount: parseFloat(feeAmount),
      screenshot: req.file.path,
      submittedBy: req.user.id,
      status: 'pending'
    });

    await payment.save();
    await payment.populate('submittedBy', 'name email');

    res.status(201).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error submitting fee payment:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all fee payments (Admin)
exports.getAllFeePayments = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate('submittedBy', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching fee payments:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single fee payment
exports.getFeePaymentById = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('verifiedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching fee payment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update payment status (Admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "verified" or "rejected"'
      });
    }

    const updateData = {
      status,
      verifiedBy: req.user.id,
      verifiedAt: new Date()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const payment = await FeePayment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('submittedBy', 'name email')
      .populate('verifiedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export upload middleware
exports.upload = upload.single('screenshot');
```

### 3. Routes
Create `server/routes/feePaymentRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const {
  submitFeePayment,
  getAllFeePayments,
  getFeePaymentById,
  updatePaymentStatus,
  upload
} = require('../controllers/feePaymentController');

// All routes require authentication
router.use(authMiddleware);

// Submit fee payment (Employee)
router.post('/submit', upload, submitFeePayment);

// Get all payments (Admin only)
router.get('/', roleMiddleware('admin'), getAllFeePayments);

// Get single payment (Admin only)
router.get('/:id', roleMiddleware('admin'), getFeePaymentById);

// Update payment status (Admin only)
router.patch('/:id/status', roleMiddleware('admin'), updatePaymentStatus);

module.exports = router;
```

### 4. Register Route in server/index.js

Add this line with other route registrations (around line 158):

```javascript
app.use('/api/fee-payments', require('./routes/feePaymentRoutes'));
```

### 5. Environment Variables
Ensure these Cloudinary variables are set in your `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Sample Inputs for Testing

### Employee Payment Form:
- **Name**: John Doe
- **Email**: john.doe@example.com
- **Phone**: 9876543210
- **Fee Amount**: 5000

### GPay UPI ID:
- Update the UPI ID in `client/src/pages/employee/FeePayment.jsx` line 19:
  ```javascript
  const GPayUPI = 'techackode@paytm'; // Replace with actual UPI ID
  ```

## Features Implemented

1. ✅ Multi-step payment form with validation
2. ✅ GPay UPI ID display with copy functionality
3. ✅ Payment screenshot upload to Cloudinary
4. ✅ Success message with payment summary
5. ✅ Admin dashboard to view all payments
6. ✅ Search and filter functionality
7. ✅ Payment status management (verify/reject)
8. ✅ Payment details modal with screenshot view
9. ✅ Statistics dashboard
10. ✅ Responsive design

## Notes

- The GPay UPI ID is currently hardcoded in the frontend. Consider making it configurable from admin settings.
- Payment screenshots are stored in Cloudinary under the `fee_payments` folder.
- All payment submissions start with "pending" status.
- Only admins can view and update payment statuses.
- The system tracks who verified/rejected each payment and when.

## Testing Checklist

- [ ] Employee can submit payment with all required fields
- [ ] Payment screenshot uploads successfully to Cloudinary
- [ ] Admin can view all payments
- [ ] Admin can search and filter payments
- [ ] Admin can verify payments
- [ ] Admin can reject payments
- [ ] Payment details modal displays correctly
- [ ] Screenshot can be downloaded
- [ ] Statistics display correctly

