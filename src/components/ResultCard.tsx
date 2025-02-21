import React from 'react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  label: string;
  value: number;
  unit: string;
}

export const ResultCard = ({ label, value, unit }: ResultCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200"
  >
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    <div className="text-xl font-semibold mt-1 dark:text-white">
      {value} {unit}
    </div>
  </motion.div>
);
