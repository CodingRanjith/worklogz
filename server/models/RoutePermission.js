const mongoose = require('mongoose');

const RoutePermissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  // Routes array: each route has a path and allowed HTTP methods
  routes: [{
    path: {
      type: String,
      required: true
    },
    methods: {
      type: [String],
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL'],
      default: []
    },
    allowed: {
      type: Boolean,
      default: true
    }
  }],
  // For backward compatibility - allowed routes (whitelist)
  allowedRoutes: [{
    type: String
  }],
  // For backward compatibility - denied routes (blacklist)
  deniedRoutes: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
RoutePermissionSchema.index({ userId: 1 });

module.exports = mongoose.model('RoutePermission', RoutePermissionSchema);

