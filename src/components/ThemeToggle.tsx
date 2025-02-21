import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={toggle}
    className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800"
    aria-label="Toggle theme"
  >
    <motion.div
      initial={false}
      animate={{ rotate: isDark ? 360 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {isDark ? (
        <Moon className="w-6 h-6 text-gray-200" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-500" />
      )}
    </motion.div>
  </motion.button>
);
