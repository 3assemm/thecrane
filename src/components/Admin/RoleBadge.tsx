import React from 'react';
import { User, Crown, Shield } from 'lucide-react';

type UserRole = 'free' | 'premium' | 'admin';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const badges = {
    free: {
      icon: User,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    premium: {
      icon: Crown,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    },
    admin: {
      icon: Shield,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
  };

  const { icon: Icon, className } = badges[role];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};
