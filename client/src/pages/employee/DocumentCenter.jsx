import React, { useState, useEffect } from 'react';
import { FiFile, FiDownload, FiSearch, FiFolder, FiCalendar, FiUser, FiTag, FiFilter } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

const DocumentCenter = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const categories = [
    { value: 'all', label: 'All Documents', color: 'gray' },
    { value: 'policy', label: 'Company Policy', color: 'blue' },
    { value: 'procedure', label: 'Procedure', color: 'green' },
    { value: 'form', label: 'Form', color: 'yellow' },
    { value: 'template', label: 'Template', color: 'purple' },
    { value: 'announcement', label: 'Announcement', color: 'red' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllDocuments, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { isPublic: 'true' }
      });

      if (response.data && response.data.success) {
        setDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load documents. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchLower) ||
        (doc.description && doc.description.toLowerCase().includes(searchLower)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleDownload = async (document) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_ENDPOINTS.downloadDocument(document._id)}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `${document.fileName} is being downloaded`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download document. Please try again.',
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  const stats = {
    total: documents.length,
    policies: documents.filter(d => d.category === 'policy').length,
    forms: documents.filter(d => d.category === 'form').length,
    procedures: documents.filter(d => d.category === 'procedure').length,
    templates: documents.filter(d => d.category === 'template').length,
    announcements: documents.filter(d => d.category === 'announcement').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-500">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl text-white">
              <FiFolder className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Document Center</h1>
              <p className="text-gray-600">Access company documents, policies, and forms</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Policies</p>
            <p className="text-2xl font-bold text-blue-600">{stats.policies}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Forms</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.forms}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Procedures</p>
            <p className="text-2xl font-bold text-green-600">{stats.procedures}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Templates</p>
            <p className="text-2xl font-bold text-purple-600">{stats.templates}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Announcements</p>
            <p className="text-2xl font-bold text-red-600">{stats.announcements}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-l-4"
                style={{ borderLeftColor: `var(--color-${getCategoryColor(document.category)}-500)` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getFileIcon(document.fileType)}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                        {document.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white bg-${getCategoryColor(document.category)}-500`}>
                        {categories.find(c => c.value === document.category)?.label || 'Other'}
                      </span>
                    </div>
                  </div>
                </div>

                {document.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {document.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiFile className="text-gray-400" />
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  {document.uploadedBy && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiUser className="text-gray-400" />
                      <span>{document.uploadedBy.name || 'Unknown'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiCalendar className="text-gray-400" />
                    <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                  </div>
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <FiTag className="text-gray-400" />
                      {document.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDownload(document)}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <FiDownload className="text-lg" />
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiFolder className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No documents found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No documents are available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCenter;

