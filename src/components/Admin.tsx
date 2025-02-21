import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle2, Clock, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { uploadLTM1030Data } from '../utils/uploadSingleCrane';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export const Admin = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [cranes, setCranes] = useState<CraneData[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.email === '3assem@gmail.com';

  useEffect(() => {
    const fetchCranes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'craneLoadCharts'));
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

    fetchCranes();
  }, [uploading]);

  const handleUpload = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can upload data');
      return;
    }

    setUploading(true);
    try {
      await uploadLTM1030Data();
      // Refresh the crane list after successful upload
      const querySnapshot = await getDocs(collection(db, 'craneLoadCharts'));
      const cranesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        craneId: doc.id
      })) as CraneData[];
      setCranes(cranesData);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-center dark:text-white">
            Access Restricted
          </h2>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Only administrators can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Crane Data Management
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload LTM 1030-2.1'}
            </motion.button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="w-6 h-6 animate-spin text-yellow-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          ) : cranes.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No crane data available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Max Boom Length
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cranes.map((crane) => (
                    <tr key={crane.craneId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {crane.manufacturer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {crane.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {crane.capacity}T
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {crane.specifications.maxBoomLength}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {formatDate(crane.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
