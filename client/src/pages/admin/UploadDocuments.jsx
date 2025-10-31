import React, { useState, useEffect } from 'react';
import { FiUpload, FiFile, FiTrash2, FiDownload, FiEye, FiFolder, FiSearch } from 'react-icons/fi';

const UploadDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'policy',
    description: '',
    file: null
  });

  const categories = [
    { value: 'policy', label: 'Company Policy', color: 'blue' },
    { value: 'procedure', label: 'Procedure', color: 'green' },
    { value: 'form', label: 'Form', color: 'yellow' },
    { value: 'template', label: 'Template', color: 'purple' },
    { value: 'announcement', label: 'Announcement', color: 'red' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  useEffect(() => {
    // Load documents from localStorage for demo
    const savedDocs = localStorage.getItem('companyDocuments');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);

  const saveDocuments = (docs) => {
    localStorage.setItem('companyDocuments', JSON.stringify(docs));
    setDocuments(docs);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    // Simulate file upload (in real scenario, upload to server)
    setTimeout(() => {
      const newDocument = {
        id: Date.now().toString(),
        title: uploadForm.title,
        category: uploadForm.category,
        description: uploadForm.description,
        fileName: uploadForm.file.name,
        fileSize: uploadForm.file.size,
        fileType: uploadForm.file.type,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Admin'
      };

      const updatedDocs = [newDocument, ...documents];
      saveDocuments(updatedDocs);

      // Reset form
      setUploadForm({
        title: '',
        category: 'policy',
        description: '',
        file: null
      });
      document.getElementById('file-input').value = '';
      
      setUploading(false);
      alert('Document uploaded successfully!');
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedDocs = documents.filter(doc => doc.id !== id);
      saveDocuments(updatedDocs);
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

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: documents.length,
    policies: documents.filter(d => d.category === 'policy').length,
    forms: documents.filter(d => d.category === 'form').length,
    others: documents.filter(d => !['policy', 'form'].includes(d.category)).length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Management</h1>
        <p className="text-gray-600">Upload and manage company documents, policies, and forms</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FiFile className="text-blue-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Policies</p>
              <p className="text-2xl font-bold text-blue-600">{stats.policies}</p>
            </div>
            <FiFolder className="text-blue-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Forms</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.forms}</p>
            </div>
            <FiFile className="text-yellow-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Others</p>
              <p className="text-2xl font-bold text-purple-600">{stats.others}</p>
            </div>
            <FiFolder className="text-purple-500 text-3xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiUpload className="text-blue-600" />
              Upload Document
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File * (Max 10MB)</label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
                {uploadForm.file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload /> Upload Document
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiFolder className="text-blue-600" />
                Documents Library
              </h2>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Documents Grid */}
            <div className="space-y-3">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiFile size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No documents found</p>
                </div>
              ) : (
                filteredDocuments.map((doc) => {
                  const colorClass = {
                    blue: 'bg-blue-100 text-blue-800',
                    green: 'bg-green-100 text-green-800',
                    yellow: 'bg-yellow-100 text-yellow-800',
                    purple: 'bg-purple-100 text-purple-800',
                    red: 'bg-red-100 text-red-800',
                    gray: 'bg-gray-100 text-gray-800'
                  }[getCategoryColor(doc.category)];

                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <FiFile className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{doc.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full font-medium ${colorClass}`}>
                                {categories.find(c => c.value === doc.category)?.label}
                              </span>
                              <span>{doc.fileName}</span>
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert('Preview functionality - would open document viewer')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Preview"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => alert('Download functionality - would download file')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Download"
                          >
                            <FiDownload size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;

