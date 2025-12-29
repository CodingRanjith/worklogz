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

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit fee payment (Employee)
exports.submitFeePayment = async (req, res) => {
  try {
    const { name, email, phone, courseName, feeAmount } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Payment screenshot is required'
      });
    }

    // Validate required fields
    if (!name || !email || !phone || !courseName || !feeAmount) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be 10 digits'
      });
    }

    // Validate fee amount
    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Fee amount must be a positive number'
      });
    }

    const payment = new FeePayment({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      courseName: courseName.trim(),
      feeAmount: amount,
      screenshot: req.file.path, // Cloudinary URL
      submittedBy: req.user._id,
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
      error: error.message || 'Failed to submit payment'
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
      error: error.message || 'Failed to fetch payments'
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
      error: error.message || 'Failed to fetch payment'
    });
  }
};

// Update payment status (Admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['done', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "done" or "rejected"'
      });
    }

    const updateData = {
      status,
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason.trim();
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
      error: error.message || 'Failed to update payment status'
    });
  }
};

// Create payment manually (Admin)
exports.createPayment = async (req, res) => {
  try {
    const { name, email, phone, courseName, feeAmount, screenshot, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !courseName || !feeAmount) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, course name, and fee amount are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be 10 digits'
      });
    }

    // Validate fee amount
    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Fee amount must be a positive number'
      });
    }

    const payment = new FeePayment({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      courseName: courseName.trim(),
      feeAmount: amount,
      screenshot: screenshot || '',
      submittedBy: req.body.submittedBy || req.user._id,
      status: status || 'pending'
    });

    await payment.save();
    await payment.populate('submittedBy', 'name email');

    res.status(201).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create payment'
    });
  }
};

// Update payment (Admin)
exports.updatePayment = async (req, res) => {
  try {
    const { name, email, phone, courseName, feeAmount, screenshot, status } = req.body;

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
      updateData.email = email.trim().toLowerCase();
    }
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Phone number must be 10 digits'
        });
      }
      updateData.phone = phone.trim();
    }
    if (courseName) updateData.courseName = courseName.trim();
    if (feeAmount) {
      const amount = parseFloat(feeAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Fee amount must be a positive number'
        });
      }
      updateData.feeAmount = amount;
    }
    if (screenshot) updateData.screenshot = screenshot;
    if (status) {
      if (!['pending', 'done', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status'
        });
      }
      updateData.status = status;
      if (status === 'done' || status === 'rejected') {
        updateData.verifiedBy = req.user._id || req.user.id;
        updateData.verifiedAt = new Date();
      }
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
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update payment'
    });
  }
};

// Delete payment (Admin)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete payment'
    });
  }
};

// Get my payments (Employee)
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await FeePayment.find({ submittedBy: req.user._id })
      .populate('submittedBy', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching my payments:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payments'
    });
  }
};

// Export upload middleware
exports.upload = upload.single('screenshot');

