const Application = require('../models/Application');

const sanitizeString = (value = '') => value.toString().trim();

exports.createApplication = async (req, res) => {
  try {
    const { name, url, category, icon } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const application = await Application.create({
      user: req.user._id,
      name: sanitizeString(name),
      url: sanitizeString(url),
      category: sanitizeString(category || 'Other'),
      icon: icon?.trim() || '🔗',
    });

    res.status(201).json({ message: 'Application added', application });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to add application' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

