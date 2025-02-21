import { useState, useEffect } from 'react';

/**
 * `useLocalStorage` Hook
 *
 * Purpose:
 * This hook provides a way to persist state in local storage. It works similarly to
 * `useState`, but it also stores the value in local storage so that it persists
 * across browser sessions.
 *
 * Usage:
 * Call this hook with a key and an initial value. It returns a stateful value,
 * and a function to update it, just like `useState`. Whenever the state is updated,
 * the new value is also saved to local storage under the given key.
 *
 * Functionality:
 * - Takes a `key` (string) and an `initialValue` as arguments.
 * - Initializes a state variable `storedValue` by trying to retrieve the value from
 *   local storage using the provided `key`. If no value is found, it uses the `initialValue`.
 * - Provides a `setValue` function to update the state. This function also saves the
 *   new value to local storage.
 * - Uses a `useEffect` hook to synchronize the state with local storage whenever the
 *   `storedValue` or `key` changes.
 * - Returns the `storedValue` and `setValue` function.
 *
 * @param {string} key - The key to use for storing the value in local storage.
 * @param {T} initialValue - The initial value to use if no value is found in local storage.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value, and a function to update it.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store the value in local storage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  /**
   * Sets the value in both state and local storage.
   *
   * @param {T | ((val: T) => T)} value - The new value or a function to update the value.
   */
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  useEffect(() => {
    // Save the current value to local storage whenever it changes
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setValue];
}
