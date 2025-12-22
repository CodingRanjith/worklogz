// Helpers for ordering and normalizing sidebar menu structures

const normalizeSubItems = (subItems = []) => {
  const normalized = subItems.map((sub, idx) => ({
    ...sub,
    order: typeof sub.order === 'number' ? sub.order : idx,
  }));

  return normalized.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order;
    }
    return 0;
  });
};

/**
 * Normalize menu items and sub-items to ensure they carry an explicit numeric
 * order and are sorted accordingly. This keeps drag-and-drop output stable
 * across the app (Master Control, Access Control, sidebars).
 */
export const normalizeMenuOrder = (items = []) => {
  const normalized = items.map((item, idx) => ({
    ...item,
    order: typeof item.order === 'number' ? item.order : idx,
    subItems: normalizeSubItems(item.subItems || []),
  }));

  return normalized.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order;
    }
    return 0;
  });
};


