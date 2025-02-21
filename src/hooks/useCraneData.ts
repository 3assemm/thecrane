import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Interface for the shape of a load chart point
interface LoadChartPoint {
  radius: number;
  capacity: number;
  boomLength: number;
}

// Interface for the shape of the crane load chart data
interface CraneLoadChart {
  craneId: string;
  manufacturer: string;
  model: string;
  points: LoadChartPoint[];
}

/**
 * `useCraneData` Hook
 *
 * Purpose:
 * This hook fetches the load chart data for a specific crane from Firestore based on the provided crane ID.
 * It manages loading and error states during the fetch operation and returns the load chart data.
 *
 * Usage:
 * Call this hook with a crane ID to retrieve the corresponding load chart data.
 * It returns an object containing the load chart data, loading state, and any error that occurred.
 *
 * Functionality:
 * - Takes a `craneId` as an argument.
 * - Initializes state variables for `loadChart`, `loading`, and `error`.
 * - Fetches the crane model details and load chart document from Firestore using the provided `craneId`.
 * - Updates the `loadChart` state with the fetched data, combining model details and load chart points.
 * - Sets the `loading` state to `true` before fetching and `false` after fetching.
 * - Sets the `error` state if there's an error during the fetch operation.
 * - Displays a toast error message if the crane model or load chart is not found or if there's an error fetching it.
 * - Returns an object containing the `loadChart`, `loading`, and `error` states.
 *
 * @param {string} craneId - The ID of the crane for which to fetch the load chart data.
 * @returns {{
 *   loadChart: CraneLoadChart | null;
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing the load chart data, loading state, and error state.
 */
export const useCraneData = (craneId: string) => {
  const [loadChart, setLoadChart] = useState<CraneLoadChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the crane model details
        const modelRef = doc(db, 'models', craneId);
        const modelSnap = await getDoc(modelRef);

        if (!modelSnap.exists()) {
          setError('Crane model not found');
          toast.error('Crane model not found');
          return;
        }

        const modelData = modelSnap.data();

        // Fetch the load chart data
        const chartRef = doc(db, 'loadCharts', craneId);
        const chartSnap = await getDoc(chartRef);

        if (!chartSnap.exists()) {
          setError('Load chart not found');
          toast.error('Load chart not found');
          return;
        }

        const chartData = chartSnap.data();

        // Combine the data
        setLoadChart({
          craneId,
          manufacturer: modelData.manufacturer,
          model: modelData.model,
          points: chartData.points || []
        });
      } catch (error: any) {
        setError('Failed to fetch load chart data');
        toast.error('Failed to fetch load chart data');
      } finally {
        setLoading(false);
      }
    };

    if (craneId) {
      fetchData();
    }
  }, [craneId]);

  return { loadChart, loading, error };
};
