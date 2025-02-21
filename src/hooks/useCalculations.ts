import { useState, useEffect, useMemo } from 'react';
import { getCalculations, deleteCalculation } from '../lib/firebase/calculations';
import { Calculation } from '../types/calculation';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * `useCalculations` Hook
 *
 * Purpose:
 * This hook is responsible for fetching, filtering, and managing the user's calculations.
 * It provides functions for deleting calculations and handles loading states. It also allows
 * filtering calculations by a search term and a date range.
 *
 * Usage:
 * Call this hook to retrieve and manage the current user's calculations.
 * It returns an object containing the calculations, loading state, delete function,
 * search term state, and date range states for filtering.
 *
 * Functionality:
 * - Fetches calculations from Firestore for the current user using `getCalculations`.
 * - Filters calculations based on a search term (`searchTerm`) and a date range (`startDate`, `endDate`).
 * - Provides a `handleDelete` function to delete a calculation by its ID.
 * - Manages `loading` state during data fetching.
 * - Uses `useMemo` to optimize the filtering of calculations, only re-filtering when necessary.
 * - Displays toast messages for success and error events using `react-hot-toast`.
 *
 * @returns {{
 *   calculations: Calculation[];
 *   loading: boolean;
 *   handleDelete: (id: string) => Promise<void>;
 *   searchTerm: string;
 *   setSearchTerm: (value: string) => void;
 *   startDate: string;
 *   setStartDate: (value: string) => void;
 *   endDate: string;
 *   setEndDate: (value: string) => void;
 * }} An object containing the calculations, loading state, delete function, and filter states.
 */
export const useCalculations = () => {
  const { currentUser } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchCalculations = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const data = await getCalculations(currentUser.uid);
        setCalculations(data);
      } catch (error) {
        toast.error('Failed to fetch calculations');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [currentUser]);

  /**
   * Deletes a calculation by its ID and updates the user's stats in Firestore.
   *
   * @param {string} id - The ID of the calculation to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calculation?')) return;
    try {
      await deleteCalculation(id);
      setCalculations(prev => prev.filter(calc => calc.id !== id));
      toast.success('Calculation deleted successfully');

      // Update userStats to decrement existingCalculations
      if (currentUser) {
        const userStatsRef = doc(db, 'userStats', currentUser.uid);
        await updateDoc(userStatsRef, {
          existingCalculations: increment(-1)
        });
      }
    } catch (error: any) {
      console.error('Error deleting calculation:', error);
      toast.error(`Failed to delete calculation: ${error.message}`);
    }
  };

  // Filter calculations based on search term and date range
  const filteredCalculations = useMemo(() => {
    return calculations.filter(calc => {
      // Search term filter
      const searchMatch =
        !searchTerm ||
        calc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.projectLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.selectedCranes.some(crane =>
          crane.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Date range filter
      let dateMatch = true;
      if (startDate && endDate) {
        const calcDate = parseISO(calc.createdAt);
        const start = startOfDay(parseISO(startDate));
        const end = endOfDay(parseISO(endDate));
        dateMatch = isWithinInterval(calcDate, { start, end });
      }

      return searchMatch && dateMatch;
    });
  }, [calculations, searchTerm, startDate, endDate]);

  return {
    calculations: filteredCalculations,
    loading,
    handleDelete,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};
