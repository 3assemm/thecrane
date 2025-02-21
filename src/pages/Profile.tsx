import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { currentUser, updateUserProfile, updateUserPassword, resendVerificationEmail } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      await updateUserProfile(name);
      toast.success('Profile updated successfully!');
      setIsUpdatingProfile(false);
      navigate('/');
    } catch (error) {
      toast.error('Failed to update profile');
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      await updateUserPassword(newPassword);
      setNewPassword('');
      toast.success('Password updated successfully!');
      setIsUpdatingPassword(false);
      navigate('/');
    } catch (error) {
      toast.error('Failed to update password');
      setIsUpdatingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Profile Settings</h1>

          {!currentUser?.emailVerified && (
            <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                Please verify your email address.
                <button
                  onClick={handleResendVerification}
                  className="ml-2 underline hover:text-yellow-600 dark:hover:text-yellow-400"
                >
                  Resend verification email
                </button>
              </p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Update Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>

          <form onSubmit={handleUpdatePassword}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
