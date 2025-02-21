import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllUserPreferences, updateUserPreferences, getUserStats } from '../lib/firebase/users';
import { UserPreferences, UserProfile } from '../types/user';
import { Search, ArrowLeft, Crown, User as UserIcon, Shield, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { BulkUpdateControls } from '../components/Admin/BulkUpdateControls';
import { UserStatsPanel } from '../components/Admin/UserStatsPanel';
import { RoleBadge } from '../components/Admin/RoleBadge';
import { formatDate } from '../utils/formatting';
import { UserDetailsModal } from '../components/Admin/UserDetailsModal';

export const UserManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [allUsersSelected, setAllUsersSelected] = useState(false);
  const [bulkUpdate, setBulkUpdate] = useState({
    emailNotifications: null as boolean | null,
    defaultUnits: null as 'metric' | 'imperial' | null,
    language: null as 'en' | 'ar' | null,
    role: null as 'free' | 'premium' | 'admin' | null
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

  const isAdmin = currentUser?.email === '3assem@gmail.com';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userProfiles = await getAllUserPreferences();
        const usersWithStats = await Promise.all(userProfiles.map(async (user) => {
          const stats = await getUserStats(user.id);
          return {
            ...user,
            totalCalculations: stats?.totalCalculations || 0,
            existingCalculations: stats?.existingCalculations || 0
          } as UserProfile;
        }));
        setUsers(usersWithStats);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, newRole: 'free' | 'premium' | 'admin') => {
    try {
      await updateUserPreferences(userId, { role: newRole });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleToggleAll = () => {
    const allUserIds = users.map(user => user.id);
    if (allUsersSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUserIds);
    }
    setAllUsersSelected(!allUsersSelected);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkUpdate = async () => {
    setIsUpdating(true);
    try {
      await Promise.all(selectedUsers.map(async (userId) => {
        const updates = Object.fromEntries(
          Object.entries(bulkUpdate).filter(([, value]) => value !== null)
        ) as Partial<UserPreferences>;
        await updateUserPreferences(userId, updates);
      }));
      toast.success('Selected users updated successfully');
      setBulkUpdate({
        emailNotifications: null,
        defaultUnits: null,
        language: null,
        role: null
      });
      setSelectedUsers([]);
      setAllUsersSelected(false);
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to update selected users');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleView = (user: UserProfile) => {
    setViewingUser(user);
  };

  const handleCloseViewModal = () => {
    setViewingUser(null);
  };

  const filteredUsers = users?.filter(user => {
    if (!user?.email || !user?.displayName) return false;
    
    const searchMatch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  }) || [];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Admin Panel</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 dark:text-white">User Management</h2>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {user.displayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'free' | 'premium' | 'admin')}
                          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          {isAdmin && (
                            <option value="admin">Admin</option>
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.emailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleView(user)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold dark:text-white">
                  Bulk Update
                </h3>
                <button
                  onClick={handleToggleAll}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-2"
                >
                  {allUsersSelected ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <BulkUpdateControls
                bulkUpdate={bulkUpdate}
                setBulkUpdate={setBulkUpdate}
                isAdmin={isAdmin}
                onUpdate={handleBulkUpdate}
              />
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                Selected Users
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.filter(user => selectedUsers.includes(user.id)).map(user => (
                  <div key={user.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold dark:text-white">{user.displayName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <RoleBadge role={user.role} />
                      </div>
                      <button
                        onClick={() => handleSelectUser(user.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center transition-colors bg-yellow-400 text-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <UserStatsPanel
                      userId={user.id}
                      totalCalculations={user.totalCalculations}
                      existingCalculations={user.existingCalculations}
                      calculationLimit={10}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {viewingUser && (
        <UserDetailsModal
          isOpen={true}
          onClose={handleCloseViewModal}
          user={viewingUser}
        />
      )}
    </div>
  );
};
