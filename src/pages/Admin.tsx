import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Construction, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CraneManagement } from '../components/Admin/CraneManagement';

/**
 * @file Admin.tsx
 *
 * @description This file contains the `Admin` component, which serves as the admin panel for the application.
 * It allows administrators to manage cranes and users.
 *
 * @module Admin
 */

/**
 * Admin component - the admin panel for the application.
 *
 * @returns {React.ReactElement} The Admin component.
 */
export const Admin: React.FC = () => {
  // Access the navigate function for navigation
  const navigate = useNavigate();
  // Access the authentication context
  const { currentUser } = useAuth();
  // State for managing the active tab
  const [activeTab, setActiveTab] = useState<'cranes' | 'users'>('cranes');
  // Access the translation function for internationalization
  const { t } = useTranslation();

  // Check if the current user is an admin
  const isAdmin = currentUser?.email === '3assem@gmail.com';

  useEffect(() => {
    // Redirect to home if the user is not an admin
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Define the tabs for the admin panel
  const tabs = [
    { id: 'cranes', label: t('admin.cranesTab'), icon: Construction },
    { id: 'users', label: t('admin.usersTab'), icon: Users },
  ];

  /**
   * Handles tab changes.
   *
   * @param {string} tabId - The ID of the tab to switch to.
   */
  const handleTabChange = (tabId: 'cranes' | 'users') => {
    if (tabId === 'users') {
      navigate('/admin/users');
    } else {
      setActiveTab(tabId);
    }
  };

  // If the user is not an admin, don't render anything
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Tab navigation */}
        <div className="mb-6 flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as 'cranes' | 'users')}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          {/* Render the appropriate component based on the active tab */}
          {activeTab === 'cranes' && <CraneManagement />}
        </motion.div>
      </div>
    </div>
  );
};
