import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle = ({ isDark, toggle }: ThemeToggleProps) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={toggle}
    className="p-2 rounded-full bg-yellow-400 dark:bg-gray-800"
    aria-label="Toggle theme"
  >
    <motion.div
      initial={false}
      animate={{ rotate: isDark ? 360 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {isDark ? (
        <Moon className="w-6 h-6 text-white" />
      ) : (
        <Sun className="w-6 h-6 text-black" />
      )}
    </motion.div>
  </motion.button>
);
