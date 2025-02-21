import { toast } from 'react-hot-toast';

export const handleAuthError = (error: any) => {
  console.error('Detailed Auth Error:', error); // Log the entire error object for debugging

  switch (error.code) {
    case 'auth/popup-blocked':
      toast.error('Please allow popups for this site to use Google sign in');
      break;
    case 'auth/popup-closed-by-user':
      toast.error('Sign in cancelled. Please try again');
      break;
    case 'auth/email-already-in-use':
      toast.error('Email already in use');
      break;
    case 'auth/invalid-email':
      toast.error('Invalid email address');
      break;
    case 'auth/weak-password':
      toast.error('Password should be at least 6 characters');
      break;
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      toast.error('Invalid email or password');
      break;
    default:
      toast.error(`An error occurred during authentication: ${error.message}`); // Display specific error message
  }
};
