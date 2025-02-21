import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserStats } from '../types/user';
import { useAuth } from '../contexts/AuthContext';

/**
 * `useUserStats` Hook
 *
 * Purpose:
 * This hook fetches and manages user statistics from Firestore. It provides
 * the user's stats data, along with loading and error states.
 *
 * Usage:
 * Call this hook to retrieve the current user's statistics. It requires the user
 * to be authenticated. It returns an object containing the user stats, loading state,
 * and any error that occurred.
 *
 * Functionality:
 * - Accesses the current user from the `AuthContext`.
 * - Initializes state variables for `stats`, `loading`, and `error`.
 * - Fetches the user's statistics document from Firestore using the current user's UID.
 * - Updates the `stats` state with the fetched data.
 * - Sets the `loading` state to `true` before fetching and `false` after fetching.
 * - Sets the `error` state if there's an error during the fetch operation.
 * - Returns an object containing the `stats`, `loading`, and `error` states.
 *
 * @returns {{
 *   stats: UserStats | null;
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing the user stats data, loading state, and error state.
 */
export const useUserStats = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const statsRef = doc(db, 'userStats', currentUser.uid);
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
          setStats(statsDoc.data() as UserStats);
        } else {
          setError('User stats not found');
          setStats(null);
        }
      } catch (err: any) {
        setError('Failed to fetch user stats');
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  return { stats, loading, error };
};
