const CustomField = require('../models/CustomField');

// Get all custom fields
exports.getAllCustomFields = async (req, res) => {
  try {
    const { fieldType, isActive } = req.query;
    const query = {};
    
    if (fieldType) {
      query.fieldType = fieldType;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const customFields = await CustomField.find(query)
      .sort({ fieldType: 1, order: 1, value: 1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.json(customFields);
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    res.status(500).json({ error: 'Failed to fetch custom fields' });
  }
};

// Get custom fields by type (for dropdowns)
exports.getCustomFieldsByType = async (req, res) => {
  try {
    const { fieldType } = req.params;
    const { includeInactive } = req.query;
    
    const query = { fieldType };
    if (includeInactive !== 'true') {
      query.isActive = true;
    }
    
    const customFields = await CustomField.find(query)
      .sort({ order: 1, value: 1 })
      .select('value description isActive order metadata');
    
    res.json(customFields);
  } catch (error) {
    console.error('Error fetching custom fields by type:', error);
    res.status(500).json({ error: 'Failed to fetch custom fields' });
  }
};

// Get all field types with their values
exports.getFieldTypesSummary = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    const query = {};
    if (includeInactive !== 'true') {
      query.isActive = true;
    }
    
    const customFields = await CustomField.find(query)
      .sort({ fieldType: 1, order: 1, value: 1 });
    
    // Group by fieldType
    const grouped = customFields.reduce((acc, field) => {
      if (!acc[field.fieldType]) {
        acc[field.fieldType] = [];
      }
      acc[field.fieldType].push({
        _id: field._id,
        value: field.value,
        description: field.description,
        isActive: field.isActive,
        order: field.order,
        metadata: field.metadata
      });
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    console.error('Error fetching field types summary:', error);
    res.status(500).json({ error: 'Failed to fetch field types summary' });
  }
};

// Create a new custom field
exports.createCustomField = async (req, res) => {
  try {
    const { fieldType, value, description, order, metadata, isActive } = req.body;
    const userId = req.user?.userId;
    
    if (!fieldType || !value) {
      return res.status(400).json({ error: 'Field type and value are required' });
    }
    
    // Check if value already exists for this field type
    const existing = await CustomField.findOne({ fieldType, value: value.trim() });
    if (existing) {
      return res.status(400).json({ error: 'This value already exists for this field type' });
    }
    
    const customField = new CustomField({
      fieldType,
      value: value.trim(),
      description: description?.trim() || '',
      order: order || 0,
      metadata: metadata || {},
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userId,
      updatedBy: userId
    });
    
    await customField.save();
    
    const populated = await CustomField.findById(customField._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating custom field:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This value already exists for this field type' });
    }
    res.status(500).json({ error: 'Failed to create custom field' });
  }
};

// Update a custom field
exports.updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, description, order, metadata, isActive } = req.body;
    const userId = req.user?.userId;
    
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    
    // If value is being changed, check for duplicates
    if (value && value.trim() !== customField.value) {
      const existing = await CustomField.findOne({
        fieldType: customField.fieldType,
        value: value.trim(),
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({ error: 'This value already exists for this field type' });
      }
      customField.value = value.trim();
    }
    
    if (description !== undefined) customField.description = description.trim();
    if (order !== undefined) customField.order = order;
    if (metadata !== undefined) customField.metadata = metadata;
    if (isActive !== undefined) customField.isActive = isActive;
    customField.updatedBy = userId;
    
    await customField.save();
    
    const populated = await CustomField.findById(customField._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.json(populated);
  } catch (error) {
    console.error('Error updating custom field:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This value already exists for this field type' });
    }
    res.status(500).json({ error: 'Failed to update custom field' });
  }
};

// Delete a custom field
exports.deleteCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    
    await CustomField.findByIdAndDelete(id);
    
    res.json({ message: 'Custom field deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom field:', error);
    res.status(500).json({ error: 'Failed to delete custom field' });
  }
};

// Bulk create custom fields
exports.bulkCreateCustomFields = async (req, res) => {
  try {
    const { fields } = req.body;
    const userId = req.user?.userId;
    
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'Fields array is required' });
    }
    
    const results = {
      created: [],
      skipped: []
    };
    
    for (const field of fields) {
      const { fieldType, value } = field;
      
      if (!fieldType || !value) {
        results.skipped.push({ field, reason: 'Missing fieldType or value' });
        continue;
      }
      
      // Check if already exists
      const existing = await CustomField.findOne({ fieldType, value: value.trim() });
      if (existing) {
        results.skipped.push({ field, reason: 'Already exists' });
        continue;
      }
      
      try {
        const customField = new CustomField({
          fieldType,
          value: value.trim(),
          description: field.description?.trim() || '',
          order: field.order || 0,
          metadata: field.metadata || {},
          isActive: field.isActive !== undefined ? field.isActive : true,
          createdBy: userId,
          updatedBy: userId
        });
        
        await customField.save();
        results.created.push(customField);
      } catch (error) {
        results.skipped.push({ field, reason: error.message });
      }
    }
    
    res.status(201).json(results);
  } catch (error) {
    console.error('Error bulk creating custom fields:', error);
    res.status(500).json({ error: 'Failed to bulk create custom fields' });
  }
};

// Toggle active status
exports.toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    
    customField.isActive = !customField.isActive;
    customField.updatedBy = userId;
    
    await customField.save();
    
    const populated = await CustomField.findById(customField._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.json(populated);
  } catch (error) {
    console.error('Error toggling active status:', error);
    res.status(500).json({ error: 'Failed to toggle active status' });
  }
};

