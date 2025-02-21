import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calculation } from '../types/calculation';
import toast from 'react-hot-toast';

/**
 * `useCalculation` Hook
 *
 * Purpose:
 * This hook is responsible for fetching a single calculation document from Firestore
 * based on the provided `calculationId`. It manages the loading and error states
 * during the fetch operation and returns the calculation data.
 *
 * Usage:
 * Use this hook in components that need to display or work with a specific
 * calculation. It should be called with the `calculationId` of the desired calculation.
 *
 * Functionality:
 * - Takes a `calculationId` as an argument.
 * - Initializes state variables for `calculation`, `loading`, and `error`.
 * - Fetches the calculation document from Firestore using the provided `calculationId`.
 * - Updates the `calculation` state with the fetched data.
 * - Sets the `loading` state to `true` before fetching and `false` after fetching.
 * - Sets the `error` state if there's an error during the fetch operation.
 * - Displays a toast error message if the calculation is not found or if there's an error fetching it.
 * - Returns an object containing the `calculation`, `loading`, and `error` states.
 *
 * @param {string | null} calculationId - The ID of the calculation to fetch.
 * @returns {{
 *   calculation: Calculation | null;
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing the calculation data, loading state, and error state.
 */
export const useCalculation = (calculationId: string | null) => {
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalculation = async () => {
      if (!calculationId) {
        setLoading(false);
        return;
      }

      try {
        const calculationRef = doc(db, 'calculations', calculationId);
        const calculationDoc = await getDoc(calculationRef);

        if (!calculationDoc.exists()) {
          setError('Calculation not found');
          toast.error('Calculation not found');
          return;
        }

        setCalculation({
          ...calculationDoc.data() as Calculation,
          id: calculationDoc.id
        });
      } catch (error: any) {
        setError('Failed to fetch calculation');
        toast.error('Failed to load calculation');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculation();
  }, [calculationId]);

  return { calculation, loading, error };
};
