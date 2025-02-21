import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calculation } from '../types/calculation';
import toast from 'react-hot-toast';

/**
 * `useCalculationEdit` Hook
 *
 * Purpose:
 * This hook is designed to manage the editing of an existing calculation. It fetches
 * the calculation data based on the provided ID, allows updating the calculation fields,
 * and handles saving the updated calculation back to Firestore.
 *
 * Usage:
 * Use this hook in components where you need to edit an existing calculation.
 * It provides the current calculation data, loading state, error state, and functions
 * to handle input changes and form submission.
 *
 * Functionality:
 * - Fetches the calculation document from Firestore using the provided `calculationId`.
 * - Initializes form data with the fetched calculation data.
 * - Provides a `handleInputChange` function to update form data fields.
 * - Provides a `handleSubmit` function to save the updated calculation to Firestore.
 * - Manages `loading` and `error` states during data fetching and saving.
 * - Displays toast messages for success and error events.
 *
 * @param {string | undefined} calculationId - The ID of the calculation to edit.
 * @returns {{
 *   calculation: Calculation | null;
 *   loading: boolean;
 *   error: string | null;
 *   formData: any;
 *   handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
 *   handleSubmit: (e: React.FormEvent) => Promise<void>;
 * }} An object containing the calculation data, loading state, error state, form data, and functions to handle input changes and form submission.
 */
export const useCalculationEdit = (calculationId: string | undefined) => {
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

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

        const data = calculationDoc.data() as Calculation;
        setCalculation(data);
        setFormData({
          projectName: data.projectName,
          projectLocation: data.projectLocation,
          projectDate: data.projectDate,
          loadWeight: data.requiredLoad,
          liftHeight: data.buildingHeight,
          liftRadius: data.liftRadius,
          craneToObstruction: data.craneEdgeDistance,
          selectedCrane: data.selectedCranes.join(', '),
          selectedUnit: 'metric', // Assuming a default value, adjust as needed
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

  /**
   * Handles changes to form input fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }, [formData]);

  /**
   * Handles form submission and updates the calculation in Firestore.
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculationId) return;

    try {
      const updatedCalculation: Calculation = {
        ...calculation!,
        projectName: formData.projectName,
        projectLocation: formData.projectLocation,
        projectDate: formData.projectDate,
        requiredLoad: parseFloat(formData.loadWeight),
        buildingHeight: parseFloat(formData.liftHeight),
        liftRadius: parseFloat(formData.liftRadius),
        craneEdgeDistance: parseFloat(formData.craneToObstruction),
        selectedCranes: formData.selectedCrane.split(',').map((s: string) => s.trim()),
        updatedAt: new Date().toISOString(),
      };

      const calculationRef = doc(db, 'calculations', calculationId);
      await updateDoc(calculationRef, updatedCalculation);
      toast.success('Calculation updated successfully');
    } catch (error: any) {
      console.error('Error updating calculation:', error);
      toast.error(`Failed to update calculation: ${error.message}`);
    }
  }, [calculationId, formData, calculation]);

  return { calculation, loading, error, formData, handleInputChange, handleSubmit };
};
