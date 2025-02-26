import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
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
  Menu,
  X, // Import the X icon for closing the mobile menu
  Palette,
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser?.email === '3assem@gmail.com';

  // Handle clicks outside the dropdown menu
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false); // Close mobile menu on larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Dropdown menu items configuration
  const dropdownMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, text: t('dashboard.myDashboard') },
    { path: '/cranes-table-list', icon: Table, text: t('dashboard.cranesTable') },
    { path: '/contact', icon: Phone, text: t('dashboard.contact') },
    { path: '/style-guide', icon: Palette, text: t('dashboard.myStyles') },
    ...(isAdmin ? [{ path: '/admin', icon: Shield, text: t('dashboard.adminPanel') }] : []),
  ];

  return (
    <header className="bg-black bg-opacity-90 text-white p-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/crane-logo.svg"
              alt="NPCrane.com Logo"
              className="h-12 w-auto"
              aria-hidden="true"
            />
            <span className="sr-only">NPCrane.com</span>
            <span aria-hidden="true">NPCrane.com</span>
          </motion.div>
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}

        {/* Navigation Links and User Menu (Desktop) */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            <Link
              to="/help"
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
            >
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
              <span>{t('help.title')}</span>
            </Link>

            {/* User Profile Dropdown */}
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  <span>{currentUser.displayName || currentUser.email}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                      role="menu"
                    >
                      {dropdownMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                          role="menuitem"
                        >
                          <item.icon className="w-4 h-4" aria-hidden="true" />
                          {item.text}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        {t('auth.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login and Signup Buttons */
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {t('auth.login')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  {t('auth.signup')}
                </button>
              </div>
            )}

            {/* Language Toggle */}
            <LanguageToggle />
          </div>
        )}

        {/* Mobile Menu (Visible on Mobile) */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={closeMobileMenu}
              />

              {/* Mobile Menu Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed left-0 top-0 h-full w-64 bg-black bg-opacity-90 text-white p-6 z-50"
              >
                <div className="space-y-4">
                  <Link
                    to="/help"
                    className="block text-white hover:text-yellow-400 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('help.title')}
                  </Link>

                  {currentUser ? (
                    <>
                      {dropdownMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block text-white hover:text-yellow-400 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {item.text}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block text-white hover:text-yellow-400 transition-colors"
                      >
                        {t('auth.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login');
                          closeMobileMenu();
                        }}
                        className="block text-white hover:text-yellow-400 transition-colors"
                      >
                        {t('auth.login')}
                      </button>
                      <button
                        onClick={() => {
                          navigate('/signup');
                          closeMobileMenu();
                        }}
                        className="block text-white hover:text-yellow-400 transition-colors"
                      >
                        {t('auth.signup')}
                      </button>
                    </>
                  )}

                  <LanguageToggle />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};