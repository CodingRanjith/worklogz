const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: String, trim: true }
  },
  { timestamps: true }
);

TeamSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Team', TeamSchema);

