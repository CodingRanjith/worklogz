import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import UserCard from '../../components/admin-dashboard/allusers/UserCard';
import EditUser from '../../components/admin-dashboard/allusers/EditUser';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

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
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`);
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
    <div className="p-6 grid grid-cols-1  gap-4">
      {users.map(user => (
        <UserCard
          key={user._id}
          user={user}
          onEdit={(id) => setEditingUserId(id)}
          onDelete={handleDeleteUser}
          isDeleting={deletingUserId === user._id}
        />
      ))}

      {/* Modal */}
      {editingUserId && (
        <EditUser
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
