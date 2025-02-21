import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCalculation } from '../hooks/useCalculation';
import { CraneCalculator } from '../components/Calculator';
import { EditModeHeader } from '../components/Calculator/EditModeHeader';

export const EditCalculation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { calculation, loading, error } = useCalculation(id || null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !calculation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || 'Calculation not found'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 flex items-center gap-2 text-yellow-500 hover:text-yellow-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <EditModeHeader calculationId={calculation.id} createdAt={calculation.createdAt} />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <CraneCalculator initialValues={calculation} editMode={true} />
        </motion.div>
      </div>
    </div>
  );
};
