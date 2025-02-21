import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { handleAuthError } from '../utils/auth';
import {
  createOrUpdateUserPreferences,
  getUserPreferences,
} from '../lib/firebase/users';

/**
 * Context for managing authentication state and providing authentication functions.
 */
const AuthContext = createContext<
  | {
      currentUser: User | null;
      loading: boolean;
      signup: (email: string, password: string, name: string) => Promise<void>;
      login: (email: string, password: string) => Promise<void>;
      logout: () => Promise<void>;
      signInWithGoogle: () => Promise<void>;
      updateUserProfile: (name: string) => Promise<void>;
      resendVerificationEmail: () => Promise<void>;
    }
  | undefined
>(undefined);

/**
 * Custom hook for accessing the authentication context.
 *
 * @returns {object} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component for the authentication context.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The provider component.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Signs up a new user with email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @param {string} name - The user's display name.
   * @returns {Promise<void>} A promise that resolves when the signup is complete.
   */
  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);

      await createOrUpdateUserPreferences({
        id: user.uid,
        email: user.email || '',
        displayName: name,
        emailVerified: false,
        role: 'free',
        defaultUnits: 'metric',
        language: 'en',
        theme: 'light',
        emailNotifications: true,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  /**
   * Logs in an existing user with email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} A promise that resolves when the login is complete.
   */
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };

  /**
   * Signs out the current user.
   *
   * @returns {Promise<void>} A promise that resolves when the sign-out is complete.
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      handleAuthError(error);
    }
  };

  /**
   * Signs in the user with Google.
   *
   * @returns {Promise<void>} A promise that resolves when the sign-in is complete.
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create a new user
      const userPreferences = await getUserPreferences(user.uid);
      if (!userPreferences) {
        await createOrUpdateUserPreferences({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          emailVerified: user.emailVerified,
          role: 'free',
          defaultUnits: 'metric',
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  /**
   * Updates the user's profile.
   *
   * @param {string} name - The new display name for the user.
   * @returns {Promise<void>} A promise that resolves when the profile update is complete.
   */
  const updateUserProfile = async (name: string) => {
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: name });
        setCurrentUser({ ...currentUser, displayName: name });
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  /**
   * Resends the verification email to the user.
   *
   * @returns {Promise<void>} A promise that resolves when the email is resent.
   */
  const resendVerificationEmail = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
