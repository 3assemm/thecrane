import React from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { uploadCraneData } from '../../utils/uploadCraneData';
import { initialCraneData } from '../../utils/initialCraneData';

export const UploadButton = () => {
  const handleUpload = async () => {
    await uploadCraneData(initialCraneData);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleUpload}
      className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
    >
      <Upload className="w-5 h-5" />
      Upload Initial Data
    </motion.button>
  );
};
