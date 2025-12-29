const CompanySettings = require('../models/CompanySettings');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

// Configure multer for Cloudinary uploads (multer-storage-cloudinary v2 factory)
const storage = cloudinaryStorage({
  cloudinary,
  folder: 'worklogz/company-logos',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
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

// Verify Cloudinary configuration
const verifyCloudinaryConfig = () => {
  const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
  const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
  const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
  
  const isConfigured = hasCloudName && hasApiKey && hasApiSecret;
  
  if (!isConfigured) {
    console.warn('⚠️  Cloudinary is not fully configured!');
    console.warn('Missing environment variables:', {
      CLOUDINARY_CLOUD_NAME: !hasCloudName,
      CLOUDINARY_API_KEY: !hasApiKey,
      CLOUDINARY_API_SECRET: !hasApiSecret
    });
    console.warn('Logo uploads will fail without proper Cloudinary configuration.');
  } else {
    console.log('✅ Cloudinary configuration verified:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'missing'
    });
  }
  
  return isConfigured;
};

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
          employeeIdPrefix: 'EMP',
          createdBy: req.user?._id
        });
      }
      
      // Ensure logo URL is properly formatted
      const responseData = settings.toObject();
      if (responseData.companyLogo) {
        // Validate and ensure URL is complete
        const logoUrl = responseData.companyLogo;
        console.log('Returning company logo URL:', logoUrl);
        
        // If it's a Cloudinary URL, ensure it's complete
        if (logoUrl && !logoUrl.startsWith('http')) {
          console.warn('⚠️  Logo URL is not a complete HTTP URL:', logoUrl);
          // Try to construct Cloudinary URL if it's just a path
          if (logoUrl.includes('cloudinary')) {
            responseData.companyLogo = `https://${logoUrl}`;
          }
        }
      }
      
      res.json(responseData);
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ error: 'Failed to fetch company settings' });
    }
  },

  // Update company settings
  updateCompanySettings: async (req, res) => {
    // Verify Cloudinary configuration before processing
    const cloudinaryConfigured = verifyCloudinaryConfig();
    
    try {
      // Handle file upload
      upload(req, res, async (err) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({ error: err.message });
        }
        
        // Check if Cloudinary is configured when trying to upload logo
        if (req.file && !cloudinaryConfigured) {
          console.error('❌ Cannot upload logo: Cloudinary not configured');
          return res.status(500).json({ 
            error: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' 
          });
        }

        try {
          let settings = await CompanySettings.findOne();
          
          const updateData = {
            ...req.body,
            updatedBy: req.user?._id
          };

          // If logo is uploaded, add it to update data
          if (req.file) {
            console.log('Logo upload detected. File info:', {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              path: req.file.path,
              url: req.file.url,
              secure_url: req.file.secure_url,
              public_id: req.file.public_id,
              format: req.file.format
            });

            // Delete old logo from Cloudinary if exists
            if (settings && settings.companyLogo) {
              try {
                // Extract public_id from Cloudinary URL
                const urlParts = settings.companyLogo.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = `worklogz/company-logos/${filename.split('.')[0]}`;
                console.log('Attempting to delete old logo from Cloudinary:', publicId);
                await cloudinary.uploader.destroy(publicId);
                console.log('Old logo deleted successfully from Cloudinary');
              } catch (deleteError) {
                console.error('Error deleting old logo from Cloudinary:', deleteError);
                // Continue even if deletion fails
              }
            }
            
            // Store the Cloudinary URL
            // multer-storage-cloudinary provides: path, url, secure_url, public_id
            // Use secure_url if available, otherwise use url or path
            const cloudinaryUrl = req.file.secure_url || req.file.url || req.file.path;
            updateData.companyLogo = cloudinaryUrl;
            console.log('Storing Cloudinary URL:', cloudinaryUrl);
            
            // Verify Cloudinary configuration
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
              console.warn('⚠️  Cloudinary environment variables not fully configured!');
              console.warn('Missing:', {
                cloud_name: !process.env.CLOUDINARY_CLOUD_NAME,
                api_key: !process.env.CLOUDINARY_API_KEY,
                api_secret: !process.env.CLOUDINARY_API_SECRET
              });
            } else {
              console.log('✅ Cloudinary configuration verified');
            }
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

          // Validate and normalize employeeIdPrefix
          if (req.body.employeeIdPrefix) {
            const prefix = req.body.employeeIdPrefix.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (prefix.length > 0 && prefix.length <= 10) {
              updateData.employeeIdPrefix = prefix;
            } else if (prefix.length === 0) {
              // If empty after cleaning, use default
              updateData.employeeIdPrefix = 'EMP';
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
          
          // Log the logo URL being returned
          if (responseData.companyLogo) {
            console.log('✅ Logo saved successfully. URL:', responseData.companyLogo);
            console.log('Logo URL type:', typeof responseData.companyLogo);
            console.log('Logo URL length:', responseData.companyLogo.length);
            
            // Verify URL format
            if (!responseData.companyLogo.startsWith('http://') && !responseData.companyLogo.startsWith('https://')) {
              console.error('❌ Logo URL is not a valid HTTP URL:', responseData.companyLogo);
            } else {
              console.log('✅ Logo URL format is valid');
            }
          }

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

