const mongoose = require('mongoose');

// Sub-item inside a sidebar category
const SidebarSubItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    path: { type: String, default: '' }, // '#' or empty for section headers
    isSection: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    icon: { type: String, default: '' }, // optional icon name string (e.g. 'FiHome')
  },
  { _id: false }
);

// Top level item (category or single link)
const SidebarItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    path: { type: String, default: '' }, // when it is a direct link
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    subItems: { type: [SidebarSubItemSchema], default: [] },
  },
  { _id: false }
);

const SidebarMenuSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ['employee', 'admin'],
      required: true,
      unique: true,
    },
    items: {
      type: [SidebarItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SidebarMenu', SidebarMenuSchema);


