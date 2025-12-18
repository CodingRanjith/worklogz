const SidebarMenu = require('../models/SidebarMenu');

// GET /api/sidebar-menu/:scope
exports.getMenuByScope = async (req, res) => {
  try {
    const scope = req.params.scope || 'employee';
    const menu = await SidebarMenu.findOne({ scope }).lean();
    if (!menu) {
      return res.json({ scope, items: [] });
    }
    res.json(menu);
  } catch (err) {
    console.error('Error fetching sidebar menu:', err);
    res.status(500).json({ error: 'Failed to fetch sidebar menu' });
  }
};

// PUT /api/sidebar-menu/:scope
exports.upsertMenuByScope = async (req, res) => {
  try {
    const scope = req.params.scope || 'employee';
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' });
    }

    const menu = await SidebarMenu.findOneAndUpdate(
      { scope },
      { scope, items },
      { new: true, upsert: true }
    );

    res.json({ message: 'Sidebar menu saved', menu });
  } catch (err) {
    console.error('Error saving sidebar menu:', err);
    res.status(500).json({ error: 'Failed to save sidebar menu' });
  }
};


