import React from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface QrUploaderProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export const QrUploader: React.FC<QrUploaderProps> = ({ onFileSelect, isProcessing }) => {
  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
        id="qr-upload"
        disabled={isProcessing}
      />
      <motion.label
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        htmlFor="qr-upload"
        className={`w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Upload className="w-6 h-6" />
        {isProcessing ? 'Processing...' : 'Upload QR Code'}
      </motion.label>
    </div>
  );
};
