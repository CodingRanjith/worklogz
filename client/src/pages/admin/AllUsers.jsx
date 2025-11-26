import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import UserCard from '../../components/admin-dashboard/allusers/UserCard';
import EditUser from '../../components/admin-dashboard/allusers/EditUser';
import CreateUser from '../../components/admin-dashboard/allusers/CreateUser';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ✅ Move fetchUsers outside useEffect so you can use it in onUpdated
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${name || 'this user'}? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.deleteUser(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      window.alert('User deleted successfully.');
    } catch (error) {
      console.error('Failed to delete user:', error);
      window.alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && !deletingUserId) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
          <p className="text-sm text-gray-500">Manage employees, update profiles, or onboard new teammates.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition-colors"
        >
          + Add User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={(id) => setEditingUserId(id)}
            onDelete={handleDeleteUser}
            isDeleting={deletingUserId === user._id}
          />
        ))}
      </div>

      {editingUserId && (
        <EditUser
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onUpdated={fetchUsers}
        />
      )}

      {isCreateModalOpen && (
        <CreateUser
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={fetchUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
