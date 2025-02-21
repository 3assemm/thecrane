import React from 'react';
import { User, Crown, Shield } from 'lucide-react';

// Type definition for user roles
type UserRole = 'free' | 'premium' | 'admin';

// Interface for the RoleBadge component props
interface RoleBadgeProps {
  role: UserRole;
}

/**
 * RoleBadge component - displays a badge indicating the user's role with an associated icon.
 *
 * @param {RoleBadgeProps} props - The component props.
 * @param {UserRole} props.role - The user's role ('free', 'premium', or 'admin').
 * @returns {React.ReactElement} The RoleBadge component.
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  // Define a mapping of roles to their corresponding icons and colors
  const badges = {
    free: {
      icon: User,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
    premium: {
      icon: Crown,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    admin: {
      icon: Shield,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
  };

  // Get the icon and class name for the current role
  const { icon: Icon, className } = badges[role];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {/* Display the icon for the role */}
      <Icon className="w-4 h-4" />
      {/* Display the role name with the first letter capitalized */}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};
