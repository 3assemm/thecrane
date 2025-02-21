import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { createOrUpdateUserPreferences } from './users';
import { handleAuthError } from '../../utils/auth';
import toast from 'react-hot-toast';

// Create a new instance of the GoogleAuthProvider
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in the user with Google using a popup.
 * If the popup is blocked, it falls back to a redirect.
 *
 * @returns {Promise<User>} A promise that resolves with the signed-in user.
 */
export const signInWithGoogle = async () => {
  try {
    // First, try popup
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleGoogleSignInSuccess(result.user);
      return result.user;
    } catch (error: any) {
      // If popup blocked, fallback to redirect
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        const result = await getRedirectResult(auth);
        if (result) {
          await handleGoogleSignInSuccess(result.user);
          return result.user;
        }
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * Logs in an existing user with email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} A promise that resolves with the signed-in user.
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * Signs up a new user with email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} name - The user's display name.
 * @returns {Promise<void>} A promise that resolves when the signup is complete.
 */
export const signup = async (
  email: string,
  password: string,
  name: string
): Promise<void> => {
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
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * Handles the success of a Google sign-in.
 * Creates or updates the user's preferences in Firestore.
 *
 * @param {User} user - The signed-in user.
 * @returns {Promise<void>} A promise that resolves when the user preferences are updated.
 */
const handleGoogleSignInSuccess = async (user: User) => {
  try {
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
  } catch (error: any) {
    console.error('Error in handleGoogleSignInSuccess:', error);
    toast.error(`Failed to update user preferences: ${error.message}`);
  }
};
