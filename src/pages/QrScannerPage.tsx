import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calculation } from '../types/calculation';
import { readQRCodeFromImage } from '../utils/qrCodeHelpers';
import { QrReader } from '../components/QrScanner/QrReader';
import { QrUploader } from '../components/QrScanner/QrUploader';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const QrScannerPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFetchCalculation = async (calculationId: string) => {
    if (!currentUser) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Authentication Required</span>
          <span className="text-sm">Please log in or sign up to view calculation details</span>
        </div>,
        { duration: 5000 }
      );
      navigate('/');
      return;
    }

    try {
      const calculationRef = doc(db, 'calculations', calculationId);
      const calculationDoc = await getDoc(calculationRef);

      if (!calculationDoc.exists()) {
        toast.error('Calculation not found');
        return;
      }

      const calculation = calculationDoc.data() as Calculation;
      navigate('/html-report', { state: { calculation } });
    } catch (error) {
      toast.error('Unable to load calculation details');
    }
  };

  const handleScan = async (data: { text: string } | null) => {
    if (data?.text) {
      await handleFetchCalculation(data.text);
    }
  };

  const handleError = (error: Error) => {
    console.error('QR Scanner Error:', error);
    toast.error('Failed to access camera');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    try {
      const qrData = await readQRCodeFromImage(file);
      await handleFetchCalculation(qrData);
    } catch (error) {
      toast.error('Failed to read QR code from image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Calculator</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 dark:text-white">QR Code Scanner</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Scan or Upload a QR code
              </p>
            </div>

            <div className="space-y-4">
              {scanning ? (
                <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
                  <QrReader
                    onError={handleError}
                    onScan={handleScan}
                  />
                  <button
                    onClick={() => setScanning(false)}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-lg"
                  >
                    Cancel Scanning
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScanning(true)}
                  className="w-full flex items-center justify-center gap-3 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white p-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  Scan using Camera
                </motion.button>
              )}

              <QrUploader
                onFileSelect={handleFileUpload}
                isProcessing={processing}
              />
            </div>

            {scanning && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Position the QR code within the camera view
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
