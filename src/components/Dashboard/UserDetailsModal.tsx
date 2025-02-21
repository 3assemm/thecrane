import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { formatDate } from '../../utils/formatting';

// Interface for the UserDetailsModal component props
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

/**
 * UserDetailsModal component - displays detailed information about a user in a modal.
 *
 * @param {UserDetailsModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is open or not.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {UserProfile} props.user - The user object containing the details to display.
 * @returns {React.ReactElement | null} The UserDetailsModal component, or null if not open.
 */
export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X className="w-6 h-6" />
        </button>

        {/* User details */}
        <h2 className="text-2xl font-bold mb-4 dark:text-white">User Details</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Name:</strong> {user.displayName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Role:</strong> {user.role}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Created At:</strong> {formatDate(user.createdAt)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last Login:</strong> {formatDate(user.lastLoginAt)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Total Calculations:</strong> {user.totalCalculations}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Existing Calculations:</strong> {user.existingCalculations}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
