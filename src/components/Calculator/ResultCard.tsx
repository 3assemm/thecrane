import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file ResultCard.tsx
 *
 * @description This file contains the `ResultCard` component, which displays a single calculation result with a label, value, and unit.
 * It uses framer-motion for a subtle hover effect.
 *
 * @module ResultCard
 */

// Interface for the ResultCard component props
interface ResultCardProps {
  label: string;
  value: number;
  unit: string;
}

/**
 * ResultCard component - displays a single calculation result with a label, value, and unit.
 * Uses framer-motion for a subtle hover effect.
 *
 * @param {ResultCardProps} props - The component props.
 * @param {string} props.label - The label for the result.
 * @param {number} props.value - The value of the result.
 * @param {string} props.unit - The unit of measurement for the result.
 * @returns {React.ReactElement} The ResultCard component.
 */
export const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      {/* Display the label for the result */}
      <p className="text-gray-700 dark:text-gray-300">{label}:</p>
      {/* Display the value and unit of the result */}
      <p className="text-lg font-semibold">{value}{unit}</p>
    </motion.div>
  );
};
