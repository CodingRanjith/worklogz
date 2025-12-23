const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to database using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const updateUsers = async () => {
  const defaultProfilePic = 'https://ui-avatars.com/api/?name=User&background=random';

  try {
    const users = await User.find();

    const updates = users.map(user => {
      user.profilePic = user.profilePic || defaultProfilePic;
      user.isActive = user.isActive ?? true;
      user.department = user.department || '';
      user.qualification = user.qualification || '';
      user.dateOfJoining = user.dateOfJoining || new Date();
      user.rolesAndResponsibility = user.rolesAndResponsibility || [];
      user.skills = user.skills || [];
      user.bankDetails = user.bankDetails || {
        bankingName: '',
        bankAccountNumber: '',
        ifscCode: '',
        upiId: ''
      };
      return user.save();
    });

    await Promise.all(updates);
    console.log('All users updated with new fields.');
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    mongoose.disconnect();
  }
};

updateUsers();
