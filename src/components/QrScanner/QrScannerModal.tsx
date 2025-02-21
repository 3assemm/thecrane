import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrReader } from 'react-qr-reader';
import { X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calculation } from '../../types/calculation';
import toast from 'react-hot-toast';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleScan = async (result: any) => {
    if (result) {
      try {
        const calculationId = result?.text;
        if (!calculationId) {
          toast.error('Invalid QR code');
          return;
        }

        const calculationRef = doc(db, 'calculations', calculationId);
        const calculationDoc = await getDoc(calculationRef);

        if (!calculationDoc.exists()) {
          toast.error('Calculation not found');
          return;
        }

        const calculation = calculationDoc.data() as Calculation;
        navigate('/html-report', { state: { calculation } });
        onClose();
      } catch (error) {
        toast.error('Failed to fetch calculation data');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Process the uploaded QR code image
      // This is a placeholder for QR code image processing
      toast.error('QR code upload not implemented yet');
    } catch (error) {
      toast.error('Failed to process QR code image');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">QR Code Scanner</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Scan or Upload a QR code</p>

        <div className="space-y-6">
          {scanning ? (
            <div className="aspect-square bg-black rounded-lg overflow-hidden">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={handleScan}
                className="w-full h-full"
              />
            </div>
          ) : (
            <button
              onClick={() => setScanning(true)}
              className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-icons">camera_alt</span>
              Scan or Upload a QR code
            </button>
          )}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-upload"
            />
            <label
              htmlFor="qr-upload"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              Scan or Upload a QR code
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
