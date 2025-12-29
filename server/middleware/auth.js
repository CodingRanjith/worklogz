const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MasterAdmin = require('../models/MasterAdmin');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Token not provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({ msg: 'Token is not valid or expired' });
    }

    if (!decoded.userId) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }
    
    // Check if this is a master admin (from separate collection)
    if (decoded.isMasterAdmin || decoded.role === 'master-admin') {
      try {
        const masterAdmin = await MasterAdmin.findById(decoded.userId).select('email isActive');
        if (!masterAdmin || !masterAdmin.isActive) {
          return res.status(401).json({ msg: 'Master admin account not found or inactive' });
        }
        
        req.user = {
          _id: decoded.userId,
          role: 'master-admin',
          adminAccess: false, // Master admin doesn't have adminAccess flag
          name: decoded.name,
          email: decoded.email,
          phone: decoded.phone,
          company: decoded.company,
          position: decoded.position,
          isMasterAdmin: true // Flag to identify master admin
        };
        return next();
      } catch (dbError) {
        console.error('Database error in auth middleware (master admin):', dbError);
        // Fallback to token data
        req.user = {
          _id: decoded.userId,
          role: 'master-admin',
          adminAccess: false,
          name: decoded.name,
          email: decoded.email,
          phone: decoded.phone,
          company: decoded.company,
          position: decoded.position,
          isMasterAdmin: true
        };
        return next();
      }
    }
    
    // Regular user from User collection
    let user;
    try {
      user = await User.findById(decoded.userId).select('role adminAccess');
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError);
      // Fallback to token data if DB query fails
      req.user = {
        _id: decoded.userId,
        role: decoded.role,
        adminAccess: false,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        company: decoded.company,
        position: decoded.position,
        isMasterAdmin: false
      };
      return next();
    }
    
    req.user = {
      _id: decoded.userId,
      role: user?.role || decoded.role,
      adminAccess: user?.adminAccess || false,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      company: decoded.company,
      position: decoded.position,
      isMasterAdmin: false
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ msg: 'Authentication error', error: err.message });
  }
};