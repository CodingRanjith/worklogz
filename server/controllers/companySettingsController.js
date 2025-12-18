const CompanySettings = require('../models/CompanySettings');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer for Cloudinary uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'worklogz/company-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
}).single('companyLogo');

const companySettingsController = {
  // Get company settings
  getCompanySettings: async (req, res) => {
    try {
      let settings = await CompanySettings.findOne();
      
      if (!settings) {
        // Create default settings if none exist
        settings = await CompanySettings.create({
          companyName: 'Worklogz',
          companyDescription: 'Employee management and HR system',
          createdBy: req.user?._id
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ error: 'Failed to fetch company settings' });
    }
  },

  // Update company settings
  updateCompanySettings: async (req, res) => {
    try {
      // Handle file upload
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        try {
          let settings = await CompanySettings.findOne();
          
          const updateData = {
            ...req.body,
            updatedBy: req.user?._id
          };

          // If logo is uploaded, add it to update data
          if (req.file) {
            // Delete old logo from Cloudinary if exists
            if (settings && settings.companyLogo) {
              try {
                // Extract public_id from Cloudinary URL
                const urlParts = settings.companyLogo.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = `worklogz/company-logos/${filename.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
              } catch (deleteError) {
                console.error('Error deleting old logo from Cloudinary:', deleteError);
                // Continue even if deletion fails
              }
            }
            // Store the Cloudinary URL (req.file.path contains the Cloudinary URL)
            updateData.companyLogo = req.file.path;
          }

          // Handle social media object
          if (req.body.socialMedia) {
            try {
              updateData.socialMedia = typeof req.body.socialMedia === 'string' 
                ? JSON.parse(req.body.socialMedia) 
                : req.body.socialMedia;
            } catch (e) {
              // If parsing fails, keep existing or use empty object
              updateData.socialMedia = settings?.socialMedia || {};
            }
          }

          if (!settings) {
            // Create new settings
            settings = await CompanySettings.create({
              ...updateData,
              createdBy: req.user?._id
            });
          } else {
            // Update existing settings
            Object.assign(settings, updateData);
            await settings.save();
          }

          // Cloudinary already returns full URL, so no conversion needed
          const responseData = settings.toObject();

          res.json({
            message: 'Company settings updated successfully',
            settings: responseData
          });
        } catch (error) {
          console.error('Error updating company settings:', error);
          res.status(500).json({ error: 'Failed to update company settings' });
        }
      });
    } catch (error) {
      console.error('Error in updateCompanySettings:', error);
      res.status(500).json({ error: 'Failed to update company settings' });
    }
  },

  // Delete company logo
  deleteCompanyLogo: async (req, res) => {
    try {
      const settings = await CompanySettings.findOne();
      
      if (settings && settings.companyLogo) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = settings.companyLogo.split('/');
          const filename = urlParts[urlParts.length - 1];
          const publicId = `worklogz/company-logos/${filename.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error('Error deleting logo from Cloudinary:', deleteError);
          // Continue even if deletion fails
        }
        
        settings.companyLogo = '';
        settings.updatedBy = req.user?._id;
        await settings.save();
      }

      res.json({ message: 'Company logo deleted successfully' });
    } catch (error) {
      console.error('Error deleting company logo:', error);
      res.status(500).json({ error: 'Failed to delete company logo' });
    }
  }
};

module.exports = companySettingsController;

