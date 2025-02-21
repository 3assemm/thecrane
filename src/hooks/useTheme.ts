import { useState, useEffect } from 'react';

/**
 * `useTheme` Hook
 *
 * Purpose:
 * This hook manages the application's theme (light or dark mode). It provides
 * the current theme state and a function to toggle between the themes.
 *
 * Usage:
 * Call this hook to get the current theme and a function to toggle it.
 * The hook also handles persisting the theme preference in local storage.
 *
 * Functionality:
 * - Initializes the theme state based on local storage or defaults to 'light'.
 * - Provides a `toggleTheme` function to switch between 'light' and 'dark' modes.
 * - Updates the `<html>` element's class to reflect the current theme (for Tailwind CSS).
 * - Persists the theme preference in local storage whenever it changes.
 *
 * @returns {{
 *   isDark: boolean;
 *   toggleTheme: () => void;
 * }} An object containing the current theme state (isDark) and the toggleTheme function.
 */
export const useTheme = () => {
  // State to track the current theme (dark mode or light mode)
  const [isDark, setIsDark] = useState(() => {
    // Check local storage for a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    // If a preference exists, use it; otherwise, default to 'light'
    return savedTheme === 'dark';
  });

  /**
   * Toggles the theme between dark and light mode.
   */
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    // Update the 'data-theme' attribute on the <html> element based on the theme
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Save the current theme to local storage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggleTheme };
};
