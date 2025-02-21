import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import {
  User,
  LogOut,
  Shield,
  HelpCircle,
  Table,
  LayoutDashboard,
  Phone,
  ChevronDown,
  Palette,
} from 'lucide-react';

/**
 * @file Header.tsx
 *
 * @description This file contains the `Header` component, which is the main navigation bar of the application.
 * It includes the logo, navigation links, user profile dropdown, language toggle, and theme toggle.
 *
 * @module Header
 */

// Interface for the Header component props
interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * Header component - the main navigation bar of the application.
 *
 * @param {HeaderProps} props - The component props.
 * @param {boolean} props.isDark - Whether the current theme is dark mode.
 * @param {() => void} props.toggleTheme - Function to toggle between light and dark themes.
 * @returns {React.ReactElement} The Header component.
 */
export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if the current user is an admin
  const isAdmin = currentUser?.email === '3assem@gmail.com';

  useEffect(() => {
    /**
     * Handles clicks outside of the user menu to close it.
     *
     * @param {MouseEvent} event - The mouse event.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="bg-black bg-opacity-90 text-white p-6 shadow-lg dark:bg-gray-900 dark:bg-opacity-90">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/crane-logo.svg"
              alt="NPCrane.com"
              className="h-12 w-auto"
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
            <div className="flex items-center gap-2">
              <span>NPCrane.com</span>
              <span className="text-sm italic text-green-14">version 1.1.1</span>
            </div>
          </motion.div>
        </Link>

        {/* Navigation Links and User Menu */}
        <div className="flex items-center gap-6">

          <Link
            to="/help"
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>{t('Help')}</span>
          </Link>

          

          {/* User Profile Dropdown */}
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{currentUser.displayName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                >
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('Dashboard')}
                  </Link>
<Link
            to="/cranes-table-list"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Table className="w-5 h-5" />
            <span>{t('CranesTable')}</span>
          </Link>

          <Link
            to="/contact"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            <span>{t('Contact')}</span>
          </Link>
						          <Link
            to="/style-guide"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Palette className="w-5 h-5" />
            <span>Style Guide</span>
          </Link>			
                  {/* Admin Panel Link (only for admin) */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      {t('AdminPanel')}
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('auth.logout')}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Login and Signup Buttons */
            <div className="space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                {t('auth.signup')}
              </button>
            </div>
          )}

          {/* Language and Theme Toggles */}
          <LanguageToggle />
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};
