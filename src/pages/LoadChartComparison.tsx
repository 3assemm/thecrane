import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText } from 'lucide-react';
import { LoadChartMatrix } from '../components/LoadChartMatrix';
import { useCraneData } from '../hooks/useCraneData';

interface LocationState {
  selectedCranes: string[];
  calculationResults: {
    totalLoad: number;
    minBoomLength: number;
    liftRadius: number;
  };
}

export const LoadChartComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedCranes, calculationResults } = location.state as LocationState;

  const handleGenerateReport = () => {
    navigate('/report', { 
      state: { 
        selectedCranes,
        calculationResults 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('craneSelection.backToResults')}</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Generate Report
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {selectedCranes.map((craneId) => (
            <LoadChartMatrix
              key={craneId}
              craneId={craneId}
              calculationResults={calculationResults}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
