import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * @file AuthModal.tsx
 *
 * @description This file contains the `AuthModal` component, which provides a modal for user authentication.
 * It supports both login and signup functionality, and allows users to sign in with Google.
 *
 * @module AuthModal
 */

// Interface for the AuthModal component props
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

/**
 * AuthModal component - provides a modal for user authentication.
 *
 * @param {AuthModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is open or not.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {'login' | 'signup'} props.mode - The authentication mode ('login' or 'signup').
 * @returns {React.ReactElement | null} The AuthModal component, or null if not open.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  // State for email input
  const [email, setEmail] = useState('');
  // State for password input
  const [password, setPassword] = useState('');
  // State for name input (only used in signup mode)
  const [name, setName] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // Get authentication functions from context
  const { signup, login, signInWithGoogle } = useAuth();
  // Get navigation function
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Handles email/password signup.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success(t('authModal.verifyEmail'));
      onClose();
    } catch (error: any) {
      console.error('Error during email sign up:', error);
      toast.error(`Sign up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles email/password login.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('authModal.loginSuccess'));
      onClose();
    } catch (error: any) {
      console.error('Error during email login:', error);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Google sign-in.
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success(t('authModal.googleSignInSuccess'));
      onClose();
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      toast.error(`Google sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Modal title */}
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {mode === 'signup' ? t('authModal.signUpTitle') : t('authModal.loginTitle')}
        </h2>

        {/* Form */}
        <form onSubmit={mode === 'signup' ? handleEmailSignUp : handleEmailLogin} className="space-y-4">
          {/* Name input (only in signup mode) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('authModal.name')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                placeholder={t('authModal.namePlaceholder')}
              />
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('authModal.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder={t('authModal.emailPlaceholder')}
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('authModal.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {loading ? (mode === 'signup' ? t('authModal.signingUp') : t('authModal.loggingIn')) : (mode === 'signup' ? t('authModal.signUp') : t('authModal.login'))}
          </button>
        </form>

        {/* Google sign-in option */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                {t('authModal.orContinueWith')}
              </span>
            </div>
          </div>

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            {mode === 'signup' ? t('authModal.signUpWithGoogle') : t('authModal.signInWithGoogle')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
