import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Clock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadInitialCraneData } from '../../utils/uploadInitialData';
import { initialCraneData } from '../../utils/initialCraneData';
import { CraneDataTable } from './CraneDataTable';
import { NewCraneForm } from './NewCraneForm';
import toast from 'react-hot-toast';

interface CraneData {
  craneId: string;
  manufacturer: string;
  model: string;
  capacity: number;
  specifications: {
    maxBoomLength: number;
  };
  updatedAt: string;
  createdBy: string;
}

export const CraneManagement: React.FC = () => {
  const [cranes, setCranes] = useState<CraneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCranes();
  }, []);

  const fetchCranes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'models'));
      const cranesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        craneId: doc.id
      })) as CraneData[];
      setCranes(cranesData);
    } catch (error) {
      toast.error('Failed to fetch crane data');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAll = async () => {
    setUploading(true);
    try {
      await uploadInitialCraneData(initialCraneData);
      await fetchCranes();
      toast.success('All crane data uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload crane data');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            Crane Data Management
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUploadAll}
            disabled={uploading}
            className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Upload All Crane Data'}
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 animate-spin text-yellow-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : (
          <CraneDataTable cranes={cranes} onRefresh={fetchCranes} />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Add New Crane
        </h2>
        <NewCraneForm onSuccess={fetchCranes} />
      </motion.div>
    </div>
  );
};
