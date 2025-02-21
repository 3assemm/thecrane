import React from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';

export const EditModeIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6"
    >
      <div className="flex items-center gap-2">
        <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <p className="text-yellow-700 dark:text-yellow-300">
          Editing existing calculation
        </p>
      </div>
    </motion.div>
  );
};
