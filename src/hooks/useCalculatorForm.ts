import { useState, useCallback } from 'react';
import { calculateBoomAngle, calculateMinBoomLength, calculateTotalLoad, calculateVerticalHeight } from '../utils/calculations';

/**
 * `useCalculatorForm` Hook
 *
 * Purpose:
 * This hook manages the form state and calculations for the crane calculator.
 * It handles form input changes, unit changes, crane selection, and performs
 * the necessary calculations based on user input.
 *
 * Usage:
 * Use this hook in the Calculator component to manage the form state and
 * calculation logic. It returns an object containing the current form values,
 * a function to handle input changes, and the calculated results.
 *
 * Functionality:
 * - Manages the state of form inputs: load weight, lift height, lift radius,
 *   crane-to-obstruction distance, selected crane, and selected unit.
 * - Provides a `handleInputChange` function to update form data fields.
 * - Provides a `handleUnitChange` function to update the selected unit.
 * - Provides a `handleCraneChange` function to update the selected crane.
 * - Calculates the boom angle, minimum boom length, vertical height, and total load
 *   based on the form input using helper functions from `../utils/calculations`.
 * - Returns an object containing the form values, a function to handle input changes,
 *   and the calculated results.
 *
 * @returns {{
 *   values: {
 *     loadWeight: string;
 *     liftHeight: string;
 *     liftRadius: string;
 *     craneToObstruction: string;
 *     selectedCrane: string;
 *     selectedUnit: string;
 *   };
 *   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 *   handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 *   handleCraneChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 *   results: {
 *     boomAngle: number;
 *     minBoomLength: number;
 *     verticalHeight: number;
 *     totalLoad: number;
 *   };
 *   calculateResults: () => void;
 * }} An object containing the form values, functions to handle input changes, and the calculated results.
 */
export const useCalculatorForm = () => {
  // State for form data
  const [values, setValues] = useState({
    loadWeight: '',
    liftHeight: '',
    liftRadius: '',
    craneToObstruction: '',
    selectedCrane: '',
    selectedUnit: 'metric',
  });

  // State for calculation results
  const [results, setResults] = useState({
    boomAngle: 0,
    minBoomLength: 0,
    verticalHeight: 0,
    totalLoad: 0,
  });

  /**
   * Handles changes to form input fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Handles changes to the unit selection.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleUnitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, selectedUnit: e.target.value }));
  }, []);

  /**
   * Handles changes to the crane selection.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleCraneChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, selectedCrane: e.target.value }));
  }, []);

  /**
   * Calculates the results based on the current form values.
   */
  const calculateResults = useCallback(() => {
    const loadWeight = parseFloat(values.loadWeight);
    const liftHeight = parseFloat(values.liftHeight);
    const liftRadius = parseFloat(values.liftRadius);
    const craneToObstruction = parseFloat(values.craneToObstruction);

    const boomAngle = calculateBoomAngle(liftHeight, liftRadius);
    const minBoomLength = calculateMinBoomLength(liftRadius, boomAngle);
    const verticalHeight = calculateVerticalHeight(minBoomLength, boomAngle);
    const totalLoad = calculateTotalLoad(loadWeight, 0); // Assuming liftTackle is 0 for now

    setResults({ boomAngle, minBoomLength, verticalHeight, totalLoad });
  }, [values]);

  return { values, handleInputChange, handleUnitChange, handleCraneChange, results, calculateResults };
};
