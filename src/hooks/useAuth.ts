import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * `useAuth` Hook
 *
 * Purpose:
 * This hook provides a convenient way to access the authentication context 
 * throughout the application. It simplifies accessing the current user's 
 * authentication state and related functions like login, signup, etc.
 *
 * Usage:
 * Import this hook into any component that needs to access the authentication
 * context. It provides an object containing the current user, loading state,
 * and authentication functions.
 *
 * Functionality:
 * - Consumes the AuthContext to access the authentication state.
 * - Throws an error if used outside of an AuthProvider.
 * - Returns the authentication context, including the current user, loading state,
 *   and functions for signup, login, logout, Google sign-in, updating user profile,
 *   and resending verification email.
 *
 * @returns {{
 *   currentUser: firebase.User | null;
 *   loading: boolean;
 *   signup: (email: string, password: string, name: string) => Promise<void>;
 *   login: (email: string, password: string) => Promise<void>;
 *   logout: () => Promise<void>;
 *   signInWithGoogle: () => Promise<void>;
 *   updateUserProfile: (name: string) => Promise<void>;
 *   resendVerificationEmail: () => Promise<void>;
 * }} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
