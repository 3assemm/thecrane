import React from 'react';
import { UserRole } from '../../types/user';

interface BulkUpdateControlsProps {
  bulkUpdate: {
    emailNotifications: boolean | null;
    defaultUnits: 'metric' | 'imperial' | null;
    language: 'en' | 'ar' | null;
    role: UserRole | null;
  };
  setBulkUpdate: React.Dispatch<React.SetStateAction<{
    emailNotifications: boolean | null;
    defaultUnits: 'metric' | 'imperial' | null;
    language: 'en' | 'ar' | null;
    role: UserRole | null;
  }>>;
  isAdmin: boolean;
  onUpdate: () => Promise<void>;
}

export const BulkUpdateControls: React.FC<BulkUpdateControlsProps> = ({
  bulkUpdate,
  setBulkUpdate,
  isAdmin,
  onUpdate
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Notifications
          </label>
          <select
            value={bulkUpdate.emailNotifications === null ? '' : bulkUpdate.emailNotifications.toString()}
            onChange={(e) => setBulkUpdate(prev => ({
              ...prev,
              emailNotifications: e.target.value === '' ? null : e.target.value === 'true'
            }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Change</option>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Units
          </label>
          <select
            value={bulkUpdate.defaultUnits || ''}
            onChange={(e) => setBulkUpdate(prev => ({
              ...prev,
              defaultUnits: e.target.value as 'metric' | 'imperial' | null
            }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Change</option>
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={bulkUpdate.language || ''}
            onChange={(e) => setBulkUpdate(prev => ({
              ...prev,
              language: e.target.value as 'en' | 'ar' | null
            }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Change</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            value={bulkUpdate.role || ''}
            onChange={(e) => setBulkUpdate(prev => ({
              ...prev,
              role: e.target.value as UserRole | null
            }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Change</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            {isAdmin && (
              <option value="admin">Admin</option>
            )}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onUpdate}
          className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
        >
          Update Selected Users
        </button>
      </div>
    </div>
  );
};
