import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/api';

/**
 * Custom hook to fetch and use custom fields by type
 * @param {string} fieldType - The type of custom field (role, department, company, etc.)
 * @param {boolean} includeInactive - Whether to include inactive fields
 * @returns {Object} - { fields, loading, error, refetch }
 */
export const useCustomFields = (fieldType, includeInactive = false) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const url = fieldType 
        ? API_ENDPOINTS.getCustomFieldsByType(fieldType) + (includeInactive ? '?includeInactive=true' : '')
        : API_ENDPOINTS.getCustomFields + (includeInactive ? '?includeInactive=true' : '');
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFields(response.data || []);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
      setError(err.response?.data?.error || 'Failed to fetch custom fields');
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [fieldType, includeInactive]);

  return {
    fields,
    loading,
    error,
    refetch: fetchFields
  };
};

/**
 * Custom hook to fetch all custom fields grouped by type
 * @param {boolean} includeInactive - Whether to include inactive fields
 * @returns {Object} - { fieldTypes, loading, error, refetch }
 */
export const useCustomFieldsSummary = (includeInactive = false) => {
  const [fieldTypes, setFieldTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const url = API_ENDPOINTS.getCustomFieldsSummary + (includeInactive ? '?includeInactive=true' : '');
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFieldTypes(response.data || {});
    } catch (err) {
      console.error('Error fetching custom fields summary:', err);
      setError(err.response?.data?.error || 'Failed to fetch custom fields summary');
      setFieldTypes({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [includeInactive]);

  return {
    fieldTypes,
    loading,
    error,
    refetch: fetchSummary
  };
};

