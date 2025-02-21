import { useState, useEffect } from 'react';

/**
 * `useDebounce` Hook
 *
 * Purpose:
 * This hook delays the update of a value until a certain amount of time has passed
 * since the last change. This is useful for scenarios like search inputs where you
 * don't want to trigger an action (e.g., API call) on every keystroke, but rather
 * after the user has stopped typing for a short period.
 *
 * Usage:
 * Call this hook with the value you want to debounce and the desired delay in milliseconds.
 * It returns the debounced value, which will only update after the specified delay.
 *
 * Functionality:
 * - Takes a `value` and a `delay` (in milliseconds) as arguments.
 * - Initializes a state variable `debouncedValue` with the initial `value`.
 * - Uses a `useEffect` hook to update `debouncedValue` after the specified `delay`.
 * - The `useEffect` hook sets a timeout that updates `debouncedValue` with the latest `value`.
 * - The timeout is cleared whenever `value` or `delay` changes, ensuring that only the last
 *   value within the delay period is set.
 * - Returns the `debouncedValue`.
 *
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set a timeout to update the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cleanup function to clear the timeout if the value or delay changes
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-run the effect if the value or delay changes
  );

  return debouncedValue;
}
