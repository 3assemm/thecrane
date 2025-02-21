import React from 'react';
import { QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const QrScanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 cursor-pointer"
      onClick={() => navigate('/qr-scanner')}
    >
      <div className="flex items-center justify-center gap-4">
        <QrCode className="w-12 h-12 text-yellow-500" />
        <div>
          <h2 className="text-xl font-semibold dark:text-white">QR Code Scanner</h2>
          <p className="text-gray-600 dark:text-gray-400">Scan or Upload a QR code</p>
        </div>
      </div>
    </motion.div>
  );
};
