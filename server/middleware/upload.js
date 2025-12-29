const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Support both v2 (factory function) and v4 (class) exports of multer-storage-cloudinary
let storage;
try {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  if (typeof CloudinaryStorage === 'function') {
    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'attendance_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
    });
  }
} catch (e) {
  // Ignore and try legacy factory import below
}

if (!storage) {
  const cloudinaryStorage = require('multer-storage-cloudinary');
  storage = cloudinaryStorage({
    cloudinary,
    folder: 'attendance_images',
    allowedFormats: ['jpg', 'jpeg', 'png'],
  });
}

const upload = multer({ storage });

module.exports = upload;
