import React from 'react';
import { useCustomFields } from '../../hooks/useCustomFields';

/**
 * Reusable dropdown component for custom fields
 * @param {string} fieldType - The type of custom field (role, department, company, etc.)
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback when value changes
 * @param {boolean} includeInactive - Whether to include inactive fields
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether the field is required
 * @param {string} className - Additional CSS classes
 * @param {boolean} showAll - Show "All" option
 */
const CustomFieldDropdown = ({
  fieldType,
  value,
  onChange,
  includeInactive = false,
  placeholder = `Select ${fieldType}...`,
  required = false,
  className = '',
  showAll = false,
  disabled = false
}) => {
  const { fields, loading } = useCustomFields(fieldType, includeInactive);

  // Sort fields by order, then by value
  const sortedFields = [...fields].sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order || 0) - (b.order || 0);
    }
    return a.value.localeCompare(b.value);
  });

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${className}`}
      required={required}
      disabled={disabled || loading}
    >
      {loading ? (
        <option>Loading...</option>
      ) : (
        <>
          {!required && <option value="">{placeholder}</option>}
          {showAll && <option value="all">All</option>}
          {sortedFields.map((field) => (
            <option key={field._id} value={field.value}>
              {field.value}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default CustomFieldDropdown;

