import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface LoadChartUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  crane: {
    craneId: string;
    specifications: {
      maxCapacity: number;
      minBoomLength: number;
      maxBoomLength: number;
      maxRadius: number;
      minRadius: number;
    };
  };
}

interface LoadChartPoint {
  radius: number;
  capacity: number;
  boomLength: number;
}

export const LoadChartUploadModal: React.FC<LoadChartUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  crane
}) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<LoadChartPoint[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (csvFile: File) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const points: LoadChartPoint[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index) => {
          const radius = Number(row.radius);
          const capacity = Number(row.capacity);
          const boomLength = Number(row.boomLength);

          // Validate each point
          if (isNaN(radius) || isNaN(capacity) || isNaN(boomLength)) {
            errors.push(`Row ${index + 1}: Invalid numbers`);
            return;
          }

          if (radius < crane.specifications.minRadius || 
              radius > crane.specifications.maxRadius) {
            errors.push(`Row ${index + 1}: Radius out of range`);
            return;
          }

          if (capacity > crane.specifications.maxCapacity) {
            errors.push(`Row ${index + 1}: Capacity exceeds maximum`);
            return;
          }

          if (boomLength < crane.specifications.minBoomLength || 
              boomLength > crane.specifications.maxBoomLength) {
            errors.push(`Row ${index + 1}: Boom length out of range`);
            return;
          }

          points.push({ radius, capacity, boomLength });
        });

        if (errors.length > 0) {
          toast.error(
            <div>
              <p>Validation errors:</p>
              <ul>
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          );
          return;
        }

        setPreview(points);
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
      }
    });
  };

  const handleUpload = async () => {
    if (!currentUser?.email === '3assem@gmail.com') {
      toast.error('Only administrators can upload load charts');
      return;
    }

    if (preview.length === 0) {
      toast.error('No valid data points to upload');
      return;
    }

    setUploading(true);
    try {
      const loadChartData = {
        craneId: crane.craneId,
        points: preview,
        createdBy: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'loadCharts', crane.craneId), loadChartData);
      toast.success('Load chart uploaded successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to upload load chart');
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
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Upload Load Chart
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select CSV File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                    <span>Upload a file</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV with columns: radius, capacity, boomLength
                </p>
              </div>
            </div>
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Preview ({preview.length} points)
              </h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Radius (m)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Capacity (T)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Boom Length (m)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {preview.map((point, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {point.radius}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {point.capacity}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {point.boomLength}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={uploading || preview.length === 0}
              className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Load Chart'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
