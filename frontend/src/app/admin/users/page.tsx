'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/auth.context';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter]);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        loadUsers(); // Reload users
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        loadUsers(); // Reload users
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and roles</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role Filter
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'SELLER' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>

                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        disabled={user.id === useAuth().user?.id} // Can't change own role
                      >
                        <option value="BUYER">Buyer</option>
                        <option value="SELLER">Seller</option>
                        <option value="ADMIN">Admin</option>
                      </select>

                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        disabled={user.id === useAuth().user?.id} // Can't deactivate self
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }